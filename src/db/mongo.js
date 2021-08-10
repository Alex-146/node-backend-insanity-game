const mongoose = require("mongoose");

const User = require("../models/User");

function connect() {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
}

function findUserById(id) {
  return User.findById(id);
}

function findByEmail(email) {
  return User.findOne({ "auth.standard.email": email });
}

module.exports = { connect, findUserById, findByEmail };