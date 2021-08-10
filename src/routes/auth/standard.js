const express = require("express");
const router = express.Router();

const { sign } = require("../../providers/jwt");
const { validateToken } = require("../../middleware/jwt");

// login using token, response is user data
router.get("/login", validateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await req.service.db.findUserById(id);
    res.json(user);
  }
  catch(error) {
    return res.status(500).json(error);
  }
});

// login using email + password, response is token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await req.service.db.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.auth.standard.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = sign({ id: user.id });
    return res.json({ token });
  }
  catch(error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    //todo
    const [code, data] = await registerViaStandard(email, password);
    return res.status(code).json(data);
  }
  catch(error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;