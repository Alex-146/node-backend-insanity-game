const axios = require("axios");
const router = require("express").Router();
const VkApi = require("../services/VkApi");

router.get("/", (req, res) => {
  return res.json(VkApi.getAuth());
});

router.get("/:id", (req, res) => {
  const { code } = req.query;
  const { id } = req.params;
  console.log(code, id);
});

router.post("/", (req, res) => {
  //todo: long polling
});

module.exports = router;