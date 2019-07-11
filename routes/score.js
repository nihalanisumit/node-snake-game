const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/", (req, res, next) => {
  const userId = req.body.userId;
  const score = req.body.score;

  console.log("user id received is " + userId + " and score is " + score);

  let currentUser = null;
  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      currentUser = user;
      user.scores.unshift(score);
      if (user.highestScore == undefined || user.highestScore == null) {
        user.highestScore = score;
      } else if (score > user.highestScore) {
        user.highestScore = score;
      }
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: "Score updated!", user: currentUser });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.get("/leaderboard", (req, res, next) => {
  User.find({})
    .sort({ highestScore: -1 })
    .exec((err, users) => {
      if (err) {
        console.log(err);
      } else {
        let data = [];
        // console.log(users);
        data = users.map(user => {
          user.name, user.highestScore;
        });
        // for (user in users) {
        //   console.log("user is" + user);
        //   let d = { name: user.name, score: user.highestScore || 0 };
        //   data.push(d);
        // }
        console.log(data);
      }
    });
  // .catch(err => console.log(err));

  router.get("/:id", (req, res, next) => {
    const userId = req.params.id;

    console.log("user id received is " + userId);
    User.findById(userId)
      .then(user => {
        if (!user) {
          const error = new Error("Could not find user.");
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({
          message: "Scores fetched.",
          scores: user.scores,
          highestScore: user.highestScore
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });

  // User.findById(userId)
  //   .then(user => {
  //     if (!user) {
  //       const error = new Error("Could not find user.");
  //       error.statusCode = 404;
  //       throw error;
  //     }
  //     res.status(200).json({
  //       message: "Scores fetched.",
  //       scores: user.scores,
  //       highestScore: user.highestScore
  //     });
  //   })
  //   .catch(err => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   });
});

module.exports = router;
