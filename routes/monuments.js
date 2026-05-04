const express = require('express');
const router = express.Router();
const Monument = require('../models/Monument');

// GET /monuments (returns JSON list)
router.get('/', async (req, res) => {
  try {
    const monuments = await Monument.find();
    res.json(monuments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /monuments/view (returns simple HTML list)
router.get('/view', async (req, res) => {
  try {
    const monuments = await Monument.find();
    let html = '<h1>Monuments</h1><ul>';
    monuments.forEach(m => {
      html += `<li><strong>${m.name}</strong> - ${m.location}</li>`;
    });
    html += '</ul>';
    res.send(html);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET /monuments/:id (fetch a single monument by ID)
router.get('/:id', async (req, res) => {
  try {
    const monument = await Monument.findById(req.params.id);
    if (!monument) {
      return res.status(404).json({ error: 'Monument not found' });
    }
    res.json(monument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /monuments (adds a new monument)
router.post('/', async (req, res) => {
  try {
    const newMonument = new Monument({
      name: req.body.name,
      location: req.body.location,
      etiquette: req.body.etiquette,
      stories: req.body.stories,
      food: req.body.food
    });

    await newMonument.save();
    res.status(201).json(newMonument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /monuments/:id (update a monument by ID)
router.put('/:id', async (req, res) => {
  try {
    const updatedMonument = await Monument.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        location: req.body.location,
        etiquette: req.body.etiquette,
        stories: req.body.stories,
        food: req.body.food
      },
      { new: true } // return the updated document
    );

    if (!updatedMonument) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    res.json(updatedMonument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /monuments/:id (delete a monument by ID)
router.delete('/:id', async (req, res) => {
  try {
    const deletedMonument = await Monument.findByIdAndDelete(req.params.id);

    if (!deletedMonument) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    res.json({ message: 'Monument deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
