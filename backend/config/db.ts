import mongoose from "npm:mongoose";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = config();

const db = mongoose.connection;

mongoose.connect(env.MONGO_URL);

db.on("error", (error) => console.error(error));
db.once("error", () => console.log("Connected to Database."));