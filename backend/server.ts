import express from "npm:express";
import env from "./config/db.ts";
import user from "./routes/user.ts";

const APP = express();

APP.use(express.json());
APP.use("/user", user);

APP.listen(env.PORT, () => {
  console.log(`Server started on ${env.PORT}`);
});
