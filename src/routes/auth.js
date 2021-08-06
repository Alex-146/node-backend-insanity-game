const express = require("express");
const router = express.Router();

router.use("/vk", require("./auth/vk"));
router.use("/google", require("./auth/google"));

router.get("/", (req, res) => {
  res.json({ message: ["vk", "google"] });
});

module.exports = router;