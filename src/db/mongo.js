const mongoose = require("mongoose");

const User = require("../models/User");

function connect() {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true
  });
}

function disconnect() {
  mongoose.disconnect();
}

function findUserById(id) {
  return User.findById(id);
}

function findByEmail(email) {
  return User.findOne({ "auth.standard.email": email });
}

function findByVk(id) {
  return User.findOne({ "auth.vk.id": id });
}

function findByGoogle(email) {
  return User.findOne({ "auth.google.email": email });
}


function pick(o, ...keys) {
  return keys.reduce((acc, key) => ({ ...acc, [key]: o[key] }), {});
}

const temp = {
  standard: {
    props: ["email", "password"],
    find: function(data) {
      return findByEmail(data.email);
    },
    validate: function(data) {
      return Object.keys(data).length === this.props.length;
    }
  },
  vk: {
    props: ["id"],
    find: function(data) {
      return findByVk(data.id);
    },
    validate: function(data) {
      return Object.keys(data).length === this.props.length;
    }
  },
  google: {
    props: ["email"],
    find: function(data) {
      return findByGoogle(data.email);
    },
    validate: function(data) {
      return Object.keys(data).length === this.props.length;
    }
  }
}

async function registerUser(method, data) {
  // todo: validate incoming data (store only required fields)
  
  const mode = temp[method];
  const candidate = await mode.find(data);
  if (candidate) return

  const inner = pick(data, ...mode.props);
  if (!mode.validate(inner)) return;
  
  const auth = {};
  auth[method] = inner

  const user = new User({ auth, roles: ["user"] });
  await user.save();
  // console.log(user.validateSync())
  return user;
}

module.exports = { connect, disconnect, findUserById, findByEmail, findByVk, findByGoogle, registerUser };