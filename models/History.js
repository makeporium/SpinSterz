// models/History.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  game: { type: String, required: true }, // CoinFlip / Mines / BikiniSwap
  result: String, // W or L
  amount: Number,
  profit: Number,
  choice: String, // Used for Mines or color choices
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
