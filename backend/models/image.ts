import { model, Schema } from "npm:mongoose";
import User from "./user.ts";

const imageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: User,
    required: true,
  },
});

export default model("Image", imageSchema);
