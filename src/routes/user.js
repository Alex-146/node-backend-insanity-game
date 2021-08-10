const { validateToken } = require("../middleware/jwt");

const express = require("express");
const router = express.Router();

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
      const user = await req.service.db.findUserById(req.params.id);
      if (!user) {
        return res.status(400).json(user);
      }
      return res.json(user);
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
  try {
    const user = await req.service.db.findUserById(req.params.id);
    if (!user) {
      return res.status(400).json(user);
    }
    return res.json(user);
  }
  catch(error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;