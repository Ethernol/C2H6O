import { Document, model, Schema } from "npm:mongoose";

export interface ITransaction {
	from_id: string;
	to_id: string;
	amount: number;
}

export interface ITransactionModel extends ITransaction, Document {}

const TransactionSchema = new Schema({
	from_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	to_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	amount: {
		type: Number,
		required: true,
	},
});

export default model<ITransactionModel>("Transaction", TransactionSchema);
