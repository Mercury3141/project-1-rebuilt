export class Item {
    constructor(id, title, importance, duedate, done, description, createdate, dbid) {
        this.id = id;
        this.title = title;
        this.importance = importance;
        this.dueDate = duedate;
        this.completed = done || false;
        this.description = description;
        this.createdate = createdate;
        this.dbid = dbid;
    }
}