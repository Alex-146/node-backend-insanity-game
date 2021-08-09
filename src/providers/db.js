const mongoose = require("mongoose");

function connect() {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
}

module.exports = { connect };