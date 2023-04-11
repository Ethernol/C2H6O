import Router from "npm:express";
import controller from "../controllers/generic.ts";
import model from "../models/address.ts";


const router = Router();

router.post("/create", controller.create(model));
router.get("/get/all", controller.getAll(model));
router.get("/get/:id", controller.get(model));
router.get("/getIdByAddress/:address", controller.getIdByAddress(model));
router.patch("/update/:id", controller.update(model));
router.delete("/delete/:id", controller.generic_delete(model));

export default router;
