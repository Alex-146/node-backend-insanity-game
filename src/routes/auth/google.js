const express = require("express");
const router = express.Router();

const googleAuth = require("../../services/GoogleAuth");

router.get("/", (req, res) => {
  res.json({ message: "google auth", url: googleAuth.getUrl() });
});

module.exports = router;