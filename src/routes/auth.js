const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ ok: true, token: process.env.TOKEN });
});

module.exports = router;