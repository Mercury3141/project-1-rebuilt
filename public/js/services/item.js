export class Item {
    constructor(id, title, importance, dueDate, completed, description, createDate, dbid) {
        this.id = id;
        this.title = title;
        this.importance = importance;
        this.dueDate = dueDate;
        this.completed = completed || false;
        this.description = description;
        this.createDate = createDate;
        this.dbid = dbid;
    }
}