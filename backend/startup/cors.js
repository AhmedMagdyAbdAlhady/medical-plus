const cors = require("cors");

module.exports = function (app) {
  const origins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

  app.use(
    cors({
      origin: origins,
      credentials: true,
      exposedHeaders: ["x-auth-token"],
    }),
  );
};
