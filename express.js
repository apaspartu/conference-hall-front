const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.static("build"));

app.get("/*", (req, res) => {
  console.log('REQUEST')
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.listen(8080, () => {
  console.log("SERVER STARTED");
  console.log(fs.existsSync(path.join(__dirname, "build", "index.html")));
});