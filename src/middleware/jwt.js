const { verify } = require("../providers/jwt");

function validateToken(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = verify(token);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  }
  catch(error) {
    res.status(500).json(error);
  }
}

module.exports = { validateToken }