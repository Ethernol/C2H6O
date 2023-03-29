import { Document, model, Schema } from "npm:mongoose";


export interface IImage {
    address_id: string;
    image_name: string;
    user_id: string;
}

export interface IImageModel extends IImage, Document {}

const ImageSchema = new Schema({
	address_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Address",
	},
	image_name: {
		type: String,
		required: true,
	},
	user_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	}
});

export default model<IImageModel>("Image", ImageSchema);
