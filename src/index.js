const express = require("express");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use("/auth", require("./routes/auth"));
app.use("/vk", require("./routes/vk"));

app.get("/", (req, res) => {
  return res.json({ ok: true });
});

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => console.log(`Server started at ${PORT}...`));