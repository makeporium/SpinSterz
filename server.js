const connectDB = require("./db");
const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/User");

// Tell express to use EJS
app.set("view engine", "ejs");

// Tell express where views folder is
app.set("views", path.join(__dirname, "views"));

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", async (req, res) => {
    const user = await User.findOne({ username: "ayush" });
    res.render("index", { coins: user.coins });
});


app.get("/HT", (req, res) => {
    res.render("HT");
});

app.get("/Mines", (req, res) => {
    res.render("Mines");
});

app.get("/HiddenGame", (req, res) => {
    res.render("HiddenGame");
});

app.get("/sc", (req, res) => {
    res.render("sc");
});

async function ensureTestUser() {
  let user = await User.findOne({ username: "ayush" });

  if (!user) {
    user = await User.create({ username: "ayush", coins: 10000 });
    console.log("Created default user:", user);
  } else {
    console.log("Found existing user:", user.username);
  }

  return user;
}

connectDB().then(() => {
  ensureTestUser();
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


