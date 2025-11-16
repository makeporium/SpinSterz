const express = require("express");
const app = express();
const path = require("path");

// Tell express to use EJS
app.set("view engine", "ejs");

// Tell express where views folder is
app.set("views", path.join(__dirname, "views"));

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.render("index");
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

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
