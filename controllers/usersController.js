const db = require("../models");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");

// Defining methods for the userController
module.exports = {
  findById: function (req, res) {
    db.Users
      .findById(req.body.id)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },

  findOne: function (req, res) {
    db.Users
      .findOne({
        email: req.body.email
      }, (err, user) => {
        if (!user) {
          return res.status(401).send({ success: false });
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err || !isMatch) {
              return res.status(401).send({ success: false });
            } else {
              const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
              return res.status(200).send({ success: true, token: token });
            }
          });
        }
      });

  },
  create: function (req, res) {
    
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      brideName: req.body.bride,
      groomName: req.body.groom,
      location: req.body.location,
      dateOfWedding: req.body.date,
    };
    console.log(newUser);
    db.Users
      .create(newUser)
      .then(dbuser => res.json(dbuser))
      .catch(err => res.status(422).json(err));
  }
};