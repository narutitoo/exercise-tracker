// models/user.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: Date
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [exerciseSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;