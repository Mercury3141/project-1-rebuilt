import { itemService } from "../services/item-service.js";
import { itemTemplate } from "../templates/item-template.js"

export class RemindersController {
    constructor() {
        this.btnContainer = document.querySelector('#btn-container');
        this.itemContainer = document.querySelector('#item-container');
        this.formContainer = document.querySelector('#form-container');
        this.form = document.querySelector('#form');

        this.btnAdd = document.querySelector('#btnAdd');
        this.btnAddInBackground = document.querySelector('#btnAddInBackground');

        this.item = [ ];
    }

    async showReminders() {
        this.itemContainer.innerHTML = itemTemplate.createItemHtml(await itemService.getItems());
    }

    hideItemForm() {
        this.btnContainer.classList.remove('invisible');
        this.itemContainer.classList.remove('invisible');
        this.formContainer.classList.add('invisible');

        this.showReminders();
    }

    showItemForm() {
        this.btnContainer.classList.add('invisible');
        this.itemContainer.classList.add('invisible');
        this.formContainer.classList.remove('invisible');
    }

    editItem(item) {
        this.item = item;
        this.form['title'].value = this.item.title;
        this.form['importance'].value = this.item.importance;
        this.form['dueDate'].value = this.item.dueDate;
        this.form['done'].checked = this.item.completed;
        this.form['description'].value = this.item.description;

        this.btnAddInBackground.dataset.action = "updateItem";
        this.btnAddInBackground.innerHTML = "Update";
        this.btnAdd.dataset.action = "updateItem";
        this.btnAdd.innerHTML = "Update & Overview";

        this.showItemForm();
    }

    async createItem(navigate) {
        if (this.checkFormValues()) {
            this.item = await itemService.addItem(this.form['title'].value, this.form['importance'].value, this.form['dueDate'].value, this.form['done'].checked, this.form['description'].value);
            if (navigate) {
                this.hideItemForm();
            } else {
                this.btnAddInBackground.dataset.action = "updateItem";
                this.btnAddInBackground.innerHTML = "Update";
                this.btnAddInBackground.dataset.action = "updateItem";
                this.btnAdd.innerHTML = "Update & Overview";
            }
        }
    }

    async updateItem(navigate) {
        if (this.checkFormValues()) {
            this.item.title = this.form['title'].value;
            this.item.importance = this.form['importance'].value;
            this.item.duedate = this.form['dueDate'].value;
            this.item.completed = this.form['done'].checked;
            this.item.description = this.form['description'].value;
            await itemService.updateItem(this.item);
            if (navigate) {
                this.hideItemForm();
            }
        }
    }

    async deleteItem(navigate) {
        await itemService.removeItem(this.item);
        if (navigate) {
            this.hideItemForm();
        }
    }

    resetForm() {
        this.form.reset();
        this.btnAddInBackground.dataset.action = "addItem";
        this.btnAddInBackground.innerHTML = "Create";
        this.btnAdd.dataset.action = "addItem";
        this.btnAdd.innerHTML = "Create & Overview";
    }

    checkFormValues() {
        this.form.reportValidity();
        if (form.title.value.length === 0) {
            return false;
        }
        if (form.importance.value.length === 0 || form.importance.value > 5) {
            return false;
        }
        return true;
    }

    updateSortSymbols(orderBy) {
        document.querySelectorAll('.sortSymbol').forEach(el => el.className = 'sortSymbol');
        const btn = orderBy.charAt(0).toUpperCase() + orderBy.slice(1);
        const sortSymbol = document.getElementById(`btn${btn}`);
        sortSymbol.className = `sortSymbol ${itemService.currentSortOrder.desc ? 'desc' : 'asc'}`;
    }

    initEventHandlers() {
        this.btnContainer.addEventListener('click', async (event) => {
            if (event.target.id === 'newItem') {
                this.resetForm();
                this.showItemForm();
            } else if (event.target.id === 'toggleFilter') {
                await itemService.toggleFilter();
                this.showReminders();
            } else if (event.target.id ==='toggleStyle') {
                document.body.classList.toggle('dark-theme');
            } else if (event.target.dataset.orderBy !== undefined && event.target.dataset.orderBy.length > 0) {
                itemService.iteSorted(event.target.dataset.orderBy);
                this.updateSortSymbols(event.target.dataset.orderBy);
                this.showReminders();
            }

        });

        this.itemContainer.addEventListener('click', (event) => {
            const id = Number(event.target.dataset.itemId);
            if (!isNaN(id)) {
                this.editItem(itemService.items.find(item => item.id === id));
            }
        });

        this.formContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                if (event.target === this.btnAddInBackground) {
                    if (event.target.dataset.action === 'addItem') {
                        this.createItem(false);
                    } else {
                        this.updateItem(false);
                    }
                } else if (event.target === this.btnAdd) {
                    if (event.target.dataset.action === 'addItem') {
                        this.createItem(true);
                    } else {
                        this.updateItem(true);
                    }
                } else if (event.target.id === 'btnDelete') {
                    this.deleteItem(true);
                } else {
                    this.hideItemForm();
                }
            }
        });
    }

    renderRemindersView() {
        this.showReminders();
    }

    async initialize() {
        this.initEventHandlers();
        await itemService.loadData();
        this.renderRemindersView();
    }
}

// create one-and-only instance
new RemindersController().initialize();