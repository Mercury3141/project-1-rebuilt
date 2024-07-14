import { Item } from './item.js';
import { DataService } from './data/data-service.js';

export class ItemService {
    constructor() {
        this.storage = new DataService();
        this.items = [ ];
        this.filter = false;
        this.currentSortOrder = { column: null, desc: false };
    }

    async getItems() {
        this.setFilter(this.filter);
        return this.items;
    }

    async loadData() {
        const allItems = await this.storage.getAll();
        this.items = allItems.map(item => new Item(item.id, item.title, item.importance, item.dueDate, item.completed, item.description, item.createDate, item._id));

        if (this.items.length === 0) {
            this.items.forEach(item => this.storage.createItems(item));
        }
    }

    itemSorted(orderBy) {
        const desc = this.currentSortOrder.column === orderBy ? !this.currentSortOrder.desc : false;
        this.currentSortOrder = { column: orderBy, desc };

        this.items.sort((a, b) => {

            if (a[orderBy] === null) return desc? -1:1;
            if (b[orderBy] === null) return desc? 1:-1;

            if (a[orderBy] < b[orderBy]) return desc? 1:-1;
            if (a[orderBy] > b[orderBy]) return desc? -1:1;
            return 0;
        });
    }

    setFilter(completed) {
        if (!completed) {
            this.items = this.items.filter(item => !item.completed);
        } else {
            this.items = this.items.filter(item => item.completed);
        }
    }

    async toggleFilter() {
        await this.loadData();
        this.setFilter(!this.filter);
        this.sortOrder(false);
        this.filter = !this.filter;
    }

    sortOrder(recoverSortOrder) {
        if (this.currentSortOrder.column !== null || recoverSortOrder === false) {
            const col = this.currentSortOrder.column || null;
            const desc = !this.currentSortOrder.desc || false;
            this.currentSortOrder = {column: col , desc};
            this.itemSorted(this.currentSortOrder.column);
        }
    }

    async addItem(title , importance, dueDate, completed, description) {
        let item = new Item(this.items.length, title, importance, dueDate, completed, description, new Date());
        item = await this.storage.createItem(item);
        item.dbid = item._id;
        this.items.push(item);
        this.sortOrder(true);

        return item;
    }

    async updateItem(item) {
        const id = item.id;
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            item.dbid = this.items[index].dbid;
            this.items[index] = item;
        }
        this.sortOrder(true);
        await this.storage.update(item);
    }


    async removeItem(item) {
        const id = item.id;
        const title = item.title;
        const index = this.items.findIndex(item => item.id === id && item.title === title);
        if (index !== -1) {
            item.dbid = this.items[index].dbid;
            await this.storage.deleteItem(item.dbid);
            this.items.splice(index, 1);
        }
    }
}

export const itemService = new ItemService();