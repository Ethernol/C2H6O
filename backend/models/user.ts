import { Document, model, Schema } from "npm:mongoose";

export interface IUser {
	address_id: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema({
	address_id: {
		type: Schema.Types.ObjectId,
		required: true,
        index: true,
        unique: true,
		ref: "Address",
	},
});

export default model<IUserModel>("User", UserSchema);
