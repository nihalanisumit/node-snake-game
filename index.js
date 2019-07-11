const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.json()); // application/json

const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/auth", authRoutes);
app.use("/score", scoreRoutes);
app.get("/", (req, res) => {
  res.send("Hellooo World!!");
});

mongoose
  .connect(
    "mongodb+srv://sumit_nihalani1:asdfghjkl@cluster0-mniuu.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(result => {
    console.log("====================================");
    console.log("connected to mongo succesfully");
    console.log("====================================");
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => console.log("error connecting to mongo" + err));
