const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { sign } = require("../providers/jwt");
const { validateToken } = require("../middleware/jwt");

router.use("/vk", require("./auth/vk"));
router.use("/google", require("./auth/google"));

router.get("/", (req, res) => {
  res.json({ message: ["vk", "google"] });
});

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get("/login", validateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    res.json(user);
  }
  catch(error) {
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const user = await User.findOne({ "auth.standard.email": email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.auth.standard.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const data = sign({ id: user.id });
    return res.json(data);
  }
  catch(error) {
    res.status(500).json(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const [code, data] = await registerViaStandard(email, password);
    return res.status(code).json(data);
  }
  catch(error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// todo: move to separate file

/**
 * 
 * @param {String} email 
 */
async function registerViaStandard(email, password) {
  const candidate = await User.findOne({ "auth.standard.email": email });
  if (candidate) {
    return [400, { message: "user already exists" }];
  }

  const user = new User({
    auth: {
      standard: {
        email, password
      }
    },
    roles: ["user"]
  });

  await user.save();
  const data = sign({ id: user.id });
  return [200, data];
}

/**
 * 
 * @param {Number} id 
 */
async function registerViaVk(id) {

}
