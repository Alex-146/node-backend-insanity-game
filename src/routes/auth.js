const express = require("express");
const router = express.Router();

router.use("/vk", require("./auth/vk"));
router.use("/google", require("./auth/google"));

router.get("/", (req, res) => {
  res.json({ message: ["vk", "google"] });
});

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use("/", require("./auth/standard"));

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
