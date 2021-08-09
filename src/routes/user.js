const express = require("express");
const User = require("../models/User");
const { validateToken } = require("../middleware/jwt");

const router = express.Router();

async function findUser(id) {
  const user = await User.findById(id);
  if (!user) {
    return [400, { message: "not found" }];
  }
  return [200, user];
}

// todo: move to separate file
const actions = {
  "addFriend": function(query) {
    return [200, { message: "addFriend" }];
  }
}

router.get("/", validateToken, async (req, res) => {
  try {
    const action = req.query.action;
    if (!action) {
      const [code, user] = await findUser(req.user.id);
      return res.status(code).json(user);
    }

    if (action in actions) {
      const [code, data] = actions[action](req.query);
      return res.status(code).json(data);
    }

    return res.status(400).json({ message: "bad action" });
  }
  catch(error) {
    return res.status(500).json({ message: error.message });
  }
});

// todo: validate token with access roles
router.get("/:id", async (req, res) => {
  const [code, user] = await findUser(req.params.id);
  return res.status(code).json(user);
});

module.exports = router;