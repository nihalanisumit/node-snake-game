const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  console.log("signup method called");

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        console.log("User already exist in the database");
        res.status(422).json({
          message: "User already exists! Try with different email id!"
        });
      } else {
        bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const newUser = new User({
              email: email,
              password: hashedPassword,
              name: name
            });

            return newUser.save();
          })
          .then(result => {
            console.log(result);
            res
              .status(201)
              .json({ message: "User created!", userId: result._id });
          });
      }
    })
    .catch(err => console.log("Error in mogo" + err));
});

router.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        res.status(401).json({ message: "Enter valid email / password." });
      } else {
        loadedUser = user;
        return bcrypt.compare(password, user.password);
      }
    })
    .then(matched => {
      if (!matched) {
        res.status(401).json({ message: "Enter valid email / password." });
      } else {
        const token = jwt.sign(
          {
            email: loadedUser.email,
            userId: loadedUser._id.toString()
          },
          "somesupersecretsecret",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          userId: loadedUser._id.toString(),
          name: loadedUser.name,
          highestScore: loadedUser.highestScore,
          message: "success"
        });
      }
    })
    .catch(err => console.log("some error occured while login" + err));
});

module.exports = router;
