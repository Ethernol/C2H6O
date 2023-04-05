import express from "npm:express";
import env from "./config/db.ts";

import address from "./routes/address.ts";
import user from "./routes/user.ts";
import image from "./routes/image.ts";
import transaction from "./routes/transaction.ts";

const APP = express();

APP.use(express.json());
APP.use("/user", user);
APP.use("/address", address);
APP.use("/image", image);
APP.use("/transaction", transaction);

APP.listen(env.PORT, () => {
    console.log(`Server started on ${env.PORT}`);
});

