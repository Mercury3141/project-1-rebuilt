import express from 'express';

const router = express.Router();
import { itemsController } from '../controller/items-controller.js'

router.get("/", itemsController.getItems);
router.post("/", itemsController.createItem);
router.put("/:id", itemsController.updateItem);
router.delete("/:id/", itemsController.deleteItem);

export const itemRoutes = router;