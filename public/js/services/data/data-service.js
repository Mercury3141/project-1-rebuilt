import { httpService } from './http-service.js'

export class DataService {
    constructor() {
    }

    async createItem(item) {
        return httpService.ajax("POST", "/items/", item);
    }

    async getAll() {
        return httpService.ajax("GET", "/items/", undefined);
    }

    async update(item) {
        return httpService.ajax("PUT", `/items/${item.dbid}`, item);
    }

    async deleteItem(id) {
        return httpService.ajax("DELETE", `/items/${id}`, undefined);
    }
}