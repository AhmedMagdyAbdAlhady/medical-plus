require("dotenv").config();

const express = require("express");
const connectDatabase = require("./startup/database");

async function start() {
  require("./startup/logging");
  require("./startup/config")();

  await connectDatabase();

  const app = express();
  require("./startup/cors")(app);
  require("./startup/routes")(app);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
