import { itemStorage } from '../services/item-store.js'

export class ItemsController {

    getItems = async (req, res) => {
        res.json((await itemStorage.all() || []))
    };

    createItem = async (req, res) => {
        res.json(await itemStorage.add(req.body));
    };

    updateItem = async (req, res) => {
        res.json(await itemStorage.update(req.params.id, req.body));
    };

    deleteItem = async (req, res) => {
        res.json(await itemStorage.delete(req.params.id));
    };
}

export const itemsController = new ItemsController();