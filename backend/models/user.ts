import { model, Schema } from "npm:mongoose";

const userSchema = new Schema({
  wallet: {
    type: String,
    required: true,
  },
});

export default model("User", userSchema);
