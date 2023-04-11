import { NextFunction, Request, Response } from 'npm:express';
import { Document, Model, Types } from 'npm:mongoose';

import { ITransaction } from '../models/transaction.ts';
import { IUser } from '../models/user.ts';
import { IImage } from '../models/image.ts';
import { IAddress } from '../models/address.ts';

type AnyModel = ITransaction | IUser | IImage | IAddress;

const create =
    (model: Model<AnyModel>) =>
    (req: Request, res: Response, _next: NextFunction) => {
        console.log('Creating a new document for ' + model.modelName);

        const doc = new model({
            _id: new Types.ObjectId(),
            ...req.body
        });

        return doc
            .save()
            .then((result: AnyModel) => res.status(201).json({ result }))
            .catch((error: Error) => res.status(500).json({ error }));
    };

const getAll =
    (model: Model<AnyModel>, populate?: string[]) =>
    (_req: Request, res: Response, _next: NextFunction) => {
        console.log('Getting all documents for ' + model.modelName);
        model
            .find<Document>()
            .populate(populate || [])
            .then((results: AnyModel) => {
                console.log(results);
                res.status(200).json({ results });
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(404).json({ error });
            });
    };

const get =
    (model: Model<AnyModel>, populate?: string[]) =>
    (req: Request, res: Response, _next: NextFunction) => {
        console.log('Getting document from ' + model.modelName + ' by id');
        const id = req.params.id;

        model
            .find<Document>({ _id: id })
            .populate(populate || [])
            .then((result: AnyModel) => {
                if (result) {
                    console.log(result);
                    res.status(200).json({ result });
                } else {
                    console.error('Not found');
                    res.status(404).json({ message: 'Document not found' });
                }
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error });
            });
    };

const getIdByAddress =
    (model: Model<IAddress>, populate?: string[]) =>
    (req: Request, res: Response, _next: NextFunction) => {
        console.log(
            'Getting document from ' + model.modelName + ' by address'
        );
        const address = req.params.address;

        model
            .find<Document>({ address: address })
            .populate(populate || [])
            .then((result: IAddress) => {
                if (result) {
                    console.log(result);
                    res.status(200).json({ result });
                } else {
                    console.error('Not found');
                    res.status(404).json({ message: 'Document not found' });
                }
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error });
            });
    };

const getByAddressId =
    (model: Model<IUser>, populate?: string[]) =>
    (req: Request, res: Response, _next: NextFunction) => {
        console.log(
            'Getting document from ' + model.modelName + ' by address id'
        );
        const address_id = req.params.address_id;

        model
            .find<Document>({ address_id: address_id })
            .populate(populate || [])
            .then((result: IUser) => {
                if (result) {
                    console.log(result);
                    res.status(200).json({ result });
                } else {
                    console.error('Not found');
                    res.status(404).json({ message: 'Document not found' });
                }
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error });
            });
    };

const update =
    (model: Model<AnyModel>, populate?: string[]) =>
    (req: Request, res: Response, _next: NextFunction) => {
        console.log('Updating document from ' + model.modelName + ' by id');
        const id = req.params.id;

        model
            .find<Document>({ _id: id })
            .populate(populate || [])
            .then((result: AnyModel) => {
                if (result) {
                    result.set(req.body);
                    return result.save().then((result: AnyModel) => {
                        console.log(result);
                        res.status(200).json({ result });
                    });
                } else {
                    console.error('Not found');
                    res.status(404).json({ message: 'Document not found' });
                }
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error });
            });
    };

const generic_delete =
    (model: Model<AnyModel>) =>
    (req: Request, res: Response, _next: NextFunction) => {
        console.log('Deleting document from ' + model.modelName + ' by id');
        const id = req.params.id;

        model
            .deleteOne<Document>({ _id: id })
            .then((result: AnyModel) => {
                if (result) {
                    console.log('Deleted element with id ' + id);
                    res.status(204).json({
                        message: 'Deleted element with id ' + id
                    });
                } else {
                    console.error('Not found');
                    res.status(404).json({ message: 'Document not found' });
                }
            })
            .catch((error: Error) => {
                console.error(error);
                res.status(500).json({ error });
            });
    };

export default {
    create,
    getAll,
    get,
    getIdByAddress,
    getByAddressId,
    update,
    generic_delete
};
