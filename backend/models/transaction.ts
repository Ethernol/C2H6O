import { model, Schema } from "npm:mongoose";

const transactionSchema = new Schema({
  user1: {
    type: String,
    required: true,
  },
  user2: {
    type: String,
    required: true,
  },  
  amount: {
    type: Intl,
    required: true,
  },
});

export default model("User", transactionSchema);
