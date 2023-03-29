// User schema, all mongo db commands available
import { NextFunction, Request, Response } from "npm:express";
import { Document, Model, Types } from "npm:mongoose";

// deno-lint-ignore no-explicit-any
const create = (model: Model<any>) =>
(
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.log("Creating a new document for " + model.modelName);

	const doc = new model({
		_id: new Types.ObjectId(),
		...req.body,
	});

	return doc
		.save()
		// deno-lint-ignore no-explicit-any
		.then((result: any) => res.status(201).json({ result }))
		.catch((error: Error) => res.status(500).json({ error }));
};

const getAll =
	// deno-lint-ignore no-explicit-any
	(model: Model<any>, populate?: string[]) =>
	(
		_req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		console.log("Getting all documents for " + model.modelName);
		model
			.find<Document>()
			.populate(populate || [])
			// deno-lint-ignore no-explicit-any
			.then((results: any) => {
				console.log(results);
				res.status(200).json({ results });
			})
			.catch((error: Error) => {
				console.error(error);
				res.status(404).json({ error });
			});
	};

const get =
	// deno-lint-ignore no-explicit-any
	(model: Model<any>, populate?: string[]) =>
	(
		req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		console.log("Getting document from " + model.modelName + " by id");
		const id = req.params.id;

		model
			.find<Document>({ _id: id })
			.populate(populate || [])
			// deno-lint-ignore no-explicit-any
			.then((result: any) => {
				if (result) {
					console.log(result);
					res.status(200).json({ result });
				} else {
					console.error("Not found");
					res.status(404).json({ message: "Document not found" });
				}
			})
			.catch((error: Error) => {
				console.error(error);
				res.status(500).json({ error });
			});
	};

const update =
	// deno-lint-ignore no-explicit-any
	(model: Model<any>, populate?: string[]) =>
	(
		req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		console.log("Updating document from " + model.modelName + " by id");
		const id = req.params.id;

		model
			.find<Document>({ _id: id })
			.populate(populate || [])
			// deno-lint-ignore no-explicit-any
			.then((result: any) => {
				if (result) {
					result.set(req.body);
					return result
						.save()
						// deno-lint-ignore no-explicit-any
						.then((result: any) => {
							console.log(result);
							res.status(200).json({ result });
						});
				} else {
					console.error("Not found");
					res.status(404).json({ message: "Document not found" });
				}
			})
			.catch((error: Error) => {
				console.error(error);
				res.status(500).json({ error });
			});
	};

const generic_delete =
	// deno-lint-ignore no-explicit-any
	(model: Model<any>) =>
	(
		req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		console.log("Deleting document from " + model.modelName + " by id");
		const id = req.params.id;

		model
			.deleteOne<Document>({ _id: id })
			// deno-lint-ignore no-explicit-any
			.then((result: any) => {
				if (result) {
					console.log("Deleted element with id " + id);
					res.status(204).json({ message: "Deleted element with id " + id });
				} else {
					console.error("Not found");
					res.status(404).json({ message: "Document not found" });
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
	update,
	generic_delete,
};
