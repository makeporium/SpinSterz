const express = require("express");
const path = require("path");
const connectDB = require("./db");
const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Get coins from DB (API for frontend JS)
app.get("/api/getCoins", async (req, res) => {
  const user = await User.findOne({ username: "ayush" });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ coins: user.coins });
});

// Update coins in DB (API called when game changes balance)
app.post("/api/updateCoins", async (req, res) => {
  const { username, amount } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  user.coins += Number(amount);
  await user.save();

  res.json({ success: true, coins: user.coins });
});

// Render pages (send DB coins to EJS)
async function renderGamePage(res, page) {
  const user = await User.findOne({ username: "ayush" });
  res.render(page, { coins: user.coins });
}

// Routes
app.get("/", async (req, res) => {
  renderGamePage(res, "index");
});

app.get("/HT", async (req, res) => {
  renderGamePage(res, "HT");
});

app.get("/Mines", async (req, res) => {
  renderGamePage(res, "Mines");
});

app.get("/HiddenGame", async (req, res) => {
  renderGamePage(res, "HiddenGame");
});

app.get("/sc", async (req, res) => {
  renderGamePage(res, "sc");
});

// Create default test user
async function ensureTestUser() {
  let user = await User.findOne({ username: "ayush" });

  if (!user) {
    user = await User.create({ username: "ayush", coins: 10000 });
    console.log("Created default user:", user);
  } else {
    console.log("Found existing user:", user.username);
  }
}

// Start server & connect DB
connectDB().then(() => ensureTestUser());

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
