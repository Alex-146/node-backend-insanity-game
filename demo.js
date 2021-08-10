(async function() {
  require("dotenv").config();
  const db = require("./src/db/mongo");
  await db.connect();
  
  // const user = await db.registerUser("standard", {
  //   email: "temp@email.com",
  //   password: "qwerty123",
  //   foo: "bar"
  // });
  
  const user = await db.registerUser("vk", {
    id: "147"
  });

  // const user = await db.registerUser("google", {
  //   email: "temp@gmail.com"
  // });

  if (user) {
    console.log(user);
  }
  else {
    console.log("Bad request");
  }

  db.disconnect();
})();