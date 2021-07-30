const router = require("express").Router();
const VkApi = require("../services/VkApi");

function validateToken() {
  return (req, res, next) => {
    const { access_token } = req.query;
    if (!access_token) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    req.access_token = access_token;
    next();
  }
}

router.get("/me", validateToken(), async (req, res) => {
  const data = await new VkApi(req.access_token).getInfo();
  return res.json(data);
});

router.get("/friends", validateToken(), async (req, res) => {
  const data = await new VkApi(req.access_token).getFriends();
  return res.json(data);
});

router.get("/friends/app", validateToken(), async (req, res) => {
  const [code, data] = await new VkApi(req.access_token).getFriendsInApp();
  return res.status(code).json(data);
});

module.exports = router;