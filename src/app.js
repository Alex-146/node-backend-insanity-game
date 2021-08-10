const express = require("express");

function createApp(db) {
  const app = express();

  function addService(service) {
    return function(req, res, next) {
      req.service = service;
      next();
    }
  }

  app.use(addService({
    db
  }));

  app.use("/auth", require("./routes/auth"));
  app.use("/vk", require("./routes/vk"));
  app.use("/user", require("./routes/user"));

  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  return app;
}

module.exports = createApp;