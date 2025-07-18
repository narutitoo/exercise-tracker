// models/user.js

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// 🔹 Subdocumento: Esquema del ejercicio
const exerciseSchema = new Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // en minutos
  date: { type: Date, required: true }
});

// 🔹 Esquema del usuario
const userSchema = new Schema({
  username: { type: String, required: true },
  log: [exerciseSchema] // Array de ejercicios
});

// 🔹 Creamos el modelo de usuario
const User = model('User', userSchema);

module.exports = User;