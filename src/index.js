if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createApp = require("./app");

async function main() {
  try {
    const db = require("./db/mongo");
    await db.connect();

    const app = createApp(db);
    const PORT = process.env.PORT ?? 5000;
    app.listen(PORT, () => console.log(`Server started at ${PORT}...`));
  }
  catch(error) {
    console.log(error);
  }
}

main();