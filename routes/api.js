// routes/api.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// ✅ Ruta: POST /api/users
// Crea un nuevo usuario
router.post('/users', async (req, res) => {
  try {
    const newUser = new User({ username: req.body.username });
    const savedUser = await newUser.save();
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// ✅ Ruta: GET /api/users
// Devuelve todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// ✅ Ruta: POST /api/users/:_id/exercises
// Agrega un ejercicio al usuario
router.post('/users/:_id/exercises', async (req, res) => {
  try {
    const { description, duration, date } = req.body;
    const user = await User.findById(req.params._id);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const newExercise = {
      description,
      duration: parseInt(duration),
      date: date ? new Date(date) : new Date()
    };

    user.log.push(newExercise);
    await user.save();

    res.json({
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date.toDateString(),
      _id: user._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar ejercicio' });
  }
});

// ✅ Ruta: GET /api/users/:_id/logs
// Devuelve el historial de ejercicios del usuario
router.get('/users/:_id/logs', async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const user = await User.findById(req.params._id);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Filtrado y formato de los logs
    let log = user.log;

    if (from) {
      const fromDate = new Date(from);
      log = log.filter(e => e.date >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      log = log.filter(e => e.date <= toDate);
    }

    if (limit) {
      log = log.slice(0, parseInt(limit));
    }

    const formattedLog = log.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString()
    }));

    res.json({
      username: user.username,
      count: formattedLog.length,
      _id: user._id,
      log: formattedLog
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener logs' });
  }
});

module.exports = router;