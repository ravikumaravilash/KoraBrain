const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/kora')
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Connection error:", err));

// Import and mount the monuments route
const monumentsRoute = require('./routes/monuments');
app.use('/monuments', monumentsRoute);

// ✅ Load monuments dataset (with lat/lon added)
const monuments = require('./monuments.json');

// 🔹 Haversine formula to calculate distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ✅ GPS Suggestions endpoint
app.get('/gps', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat/lon" });
  }

  // Calculate distance for each monument
  const nearby = monuments.map(m => {
    if (m.latitude && m.longitude) {
      const distance = getDistance(lat, lon, m.latitude, m.longitude);
      return { ...m, distance: distance.toFixed(2) + " km" };
    }
    return { ...m, distance: "Unknown" };
  });

  // Sort by nearest
  nearby.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  // Return top 5
  res.json(nearby.slice(0, 5));
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello from Kora Brain!');
});

// Start the server
app.listen(3000, () => {
  console.log('Kora Brain running at http://localhost:3000');
});
