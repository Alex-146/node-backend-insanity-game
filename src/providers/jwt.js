const jwt = require("jsonwebtoken");

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function verify(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
  catch(error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error.message);
    }
    else if (error instanceof jwt.TokenExpiredError) {
      //todo: generate new token
    }
    else if (error instanceof jwt.NotBeforeError) {
      // todo: what should I do?
    }
  }
}

module.exports = { sign, verify };