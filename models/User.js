const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // NEW
  coins: { type: Number, default: 10000 }
});

module.exports = mongoose.model("User", userSchema);
