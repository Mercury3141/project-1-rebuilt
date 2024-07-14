import { Item } from './item.js';
import { DataService } from './data/data-service.js';

export class ItemService {
    constructor() {
        this.storage = new DataService();
        this.items = [];
        this.filter = false;
        this.currentSortOrder = { column: null, desc: false };
    }

    async getItems() {
        this.applyFilter();
        return this.items;
    }

    async loadData() {
        const allItems = await this.storage.getAll();
        this.items = allItems.map(item => new Item(
            item.id, item.title, item.importance, item.dueDate, item.completed, item.description, item.createDate, item._id
        ));

        if (this.items.length === 0) {
            await Promise.all(this.items.map(item => this.storage.createItem(item)));
        }
    }

    sortItems(orderBy) {
        const desc = this.currentSortOrder.column === orderBy ? !this.currentSortOrder.desc : false;
        this.currentSortOrder = { column: orderBy, desc };

        this.items.sort((a, b) => {
            if (a[orderBy] === null) return desc ? -1 : 1;
            if (b[orderBy] === null) return desc ? 1 : -1;
            return a[orderBy] < b[orderBy] ? (desc ? 1 : -1) : (desc ? -1 : 1);
        });
    }

    applyFilter() {
        this.items = this.items.filter(item => this.filter ? item.completed : !item.completed);
    }

    async toggleFilter() {
        await this.loadData();
        this.filter = !this.filter;
        this.applyFilter();
        this.sortItems(this.currentSortOrder.column);
    }

    async addItem(title, importance, dueDate, completed, description) {
        let item = new Item(this.items.length, title, importance, dueDate, completed, description, new Date());
        item = await this.storage.createItem(item);
        item.dbid = item._id;
        this.items.push(item);
        this.sortItems(this.currentSortOrder.column);

        return item;
    }

    async updateItem(item) {
        const index = this.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
            item.dbid = this.items[index].dbid;
            this.items[index] = item;
        }
        this.sortItems(this.currentSortOrder.column);
        await this.storage.update(item);
    }

    async removeItem(item) {
        const index = this.items.findIndex(i => i.id === item.id && i.title === item.title);
        if (index !== -1) {
            const dbid = this.items[index].dbid;
            await this.storage.deleteItem(dbid);
            this.items.splice(index, 1);
        }
    }
}

export const itemService = new ItemService();
