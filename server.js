const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const connectDB = require("./db");
const User = require("./models/User");
const History = require("./models/History");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// Make session available in EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ---------------- AUTH MIDDLEWARE ----------------
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// ---------------- EJS SETUP ----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------------- AUTH ROUTES ----------------
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.send("User exists");

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash, coins: 10000 });

  req.session.user = user;
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.send("User not found");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Wrong password");

  req.session.user = user;
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// ---------------- GAME API ----------------
app.get("/api/getCoins", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.json({ coins: user.coins });
});

app.post("/api/updateCoins", requireLogin, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.session.user._id);

  user.coins += Number(amount);
  await user.save();

  res.json({ success: true, coins: user.coins });
});

// SAVE HISTORY (UPDATED FOR MINES)
app.post("/api/saveHistory", requireLogin, async (req, res) => {
  const { result, amount, profit, game, choice } = req.body;

  await History.create({
    user: req.session.user._id,
    game: game || "CoinFlip",  // <= now dynamic
    result,
    amount,
    profit,
    choice: choice || null,   // useful for Mines
  });

  res.json({ success: true });
});

// GET HISTORY
app.get("/api/getHistory", requireLogin, async (req, res) => {
  const history = await History.find({ user: req.session.user._id })
    .sort({ time: -1 })
    .limit(5);

  res.json(history);
});

// ---------------- PAGES ----------------
function renderGamePage(req, res, page) {
  res.render(page);
}

app.get("/", requireLogin, (req, res) => renderGamePage(req, res, "index"));
app.get("/HT", requireLogin, (req, res) => renderGamePage(req, res, "HT"));
app.get("/Mines", requireLogin, (req, res) => renderGamePage(req, res, "Mines"));
app.get("/HiddenGame", requireLogin, (req, res) => renderGamePage(req, res, "HiddenGame"));
app.get("/sc", requireLogin, (req, res) => renderGamePage(req, res, "sc"));

// ---------------- START ----------------
connectDB();
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
