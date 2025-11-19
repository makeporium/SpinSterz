// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  coins: { type: Number, default: 10000 }, // starting coins
});

const User = mongoose.model("User", userSchema);

module.exports = User;
