import DataStore from 'nedb-promises';

export class ItemStorage {
    constructor(db) {
        const options = process.env.DB_TYPE === "FILE" ? {filename: './data/items.db', autoload: true} : {}
        this.db = db || new DataStore(options);
    }

    async add(item) {
        return this.db.insert(item);
    }

    async delete(aId) {
        this.db.remove({_id: aId});
        return this.get(aId);
    }

    async update(aId, item) {
        this.db.update({_id: aId},
            {$set: {
                    "title": item.title,
                    "importance": item.importance,
                    "dueDate": item.duedate,
                    "completed": item.completed,
                    "description": item.description
                }});
        return this.get(item.dbid);
    }

    async get(aId) {
        return this.db.findOne({_id: aId});
    }

    async all() {
        return this.db.find({});
    }
}

export const itemStorage = new ItemStorage();