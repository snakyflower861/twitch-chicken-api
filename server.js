const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const DB_PATH = path.join(__dirname, "chickens.json");

// Load DB or create if missing
let db = {};
if (fs.existsSync(DB_PATH)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_PATH));
  } catch (e) {
    db = {};
  }
}

// Save DB helper
function saveDB() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Adopt a chicken
app.get("/adopt", (req, res) => {
  const user = (req.query.user || "").toLowerCase();
  if (!user) return res.send("Invalid user.");

  if (db[user]) return res.send(`${req.query.user} already has a chicken! 🐔`);

  db[user] = true;
  saveDB();
  res.send(`${req.query.user} adopted a chicken! 🐔`);
});

// Boom a chicken
app.get("/boom", (req, res) => {
  const target = (req.query.target || "").toLowerCase();
  if (!target) return res.send("No target specified.");

  if (!db[target])
    return res.send(`${req.query.target} has no chicken to explode! 😇`);

  delete db[target];
  saveDB();
  res.send(`💥 ${req.query.target}'s chicken exploded in a glorious fireball!`);
});

// Root check
app.get("/", (req, res) => {
  res.send("Chicken API is live 🐔🔥");
});

// Render requires listening on process.env.PORT
app.listen(process.env.PORT || 3000, () =>
  console.log("Chicken API running!")
);
