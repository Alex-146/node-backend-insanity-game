const express = require("express");
const router = express.Router();
const VkApi = require("../../services/VkApi");
const EventEmitter = require("events").EventEmitter;

const emitter = new EventEmitter();

router.get("/", (req, res) => {
  return res.json(VkApi.getAuth());
});

router.get("/:id", async (req, res) => {
  try {
    const { code } = req.query;
    const { id } = req.params;
    if (code && id) {
      const { data } = await VkApi.getAccessToken(code, id);
      const { access_token } = data;
      emitter.emit(`TOKEN_RECEIVED_${id}`, access_token);

      // todo: render template with <access_token> and instructions if in-game auth doesnt happened
      res.json({ ok: true });
    }
    else {
      res.status(400).json({ message: "Bad Request" });
    }
  }
  catch(error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
});

router.post("/", express.urlencoded({ extended: false }), (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      emitter.once(`TOKEN_RECEIVED_${id}`, (access_token) => {
        return res.json({ access_token });
      });
    }
    else {
      return res.status(400).json({ ok: false, message: "provide id" });
    }
  }
  catch(error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;