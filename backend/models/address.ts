import { Document, model, Schema } from 'npm:mongoose';

export interface IAddress {
    address: string;
}

export interface IAddressModel extends IAddress, Document {}

const AddressSchema = new Schema({
    address: {
        type: String,
        required: true,
        index: true,
        unique: true
    }
});

export default model<IAddressModel>('Address', AddressSchema);
