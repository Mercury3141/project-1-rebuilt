import { itemService } from "../services/item-service.js";
import { itemTemplate } from "../templates/item-template.js";

export class RemindersController {
    constructor() {
        this.initElements();
        this.items = [];
    }

    initElements() {
        const querySelector = (id) => document.querySelector(id);
        this.btnContainer = querySelector('#btn-container');
        this.itemContainer = querySelector('#item-container');
        this.formContainer = querySelector('#form-container');
        this.form = querySelector('#form');
        this.btnAdd = querySelector('#btnAdd');
        this.btnAddInBackground = querySelector('#btnAddInBackground');
    }

    async showReminders() {
        const items = await itemService.getItems();
        this.itemContainer.innerHTML = itemTemplate.createItemHtml(items);
    }

    toggleVisibility(showForm) {
        const classAction = showForm ? 'add' : 'remove';
        this.btnContainer.classList.toggle('invisible', showForm);
        this.itemContainer.classList.toggle('invisible', showForm);
        this.formContainer.classList.toggle('invisible', !showForm);
    }

    hideItemForm() {
        this.toggleVisibility(false);
        this.showReminders();
    }

    showItemForm() {
        this.toggleVisibility(true);
    }

    populateForm(item) {
        this.form['title'].value = item.title;
        this.form['importance'].value = item.importance;
        this.form['dueDate'].value = item.dueDate;
        this.form['completed'].checked = item.completed;
        this.form['description'].value = item.description;
    }

    setFormForEdit() {
        this.btnAddInBackground.dataset.action = "updateItem";
        this.btnAddInBackground.innerHTML = "Update";
        this.btnAdd.dataset.action = "updateItem";
        this.btnAdd.innerHTML = "Update & Overview";
    }

    editItem(item) {
        this.item = item;
        this.populateForm(item);
        this.setFormForEdit();
        this.showItemForm();
    }

    async handleItemAction(navigate, isUpdate) {
        if (this.checkFormValues()) {
            const formData = {
                title: this.form['title'].value,
                importance: this.form['importance'].value,
                dueDate: this.form['dueDate'].value,
                completed: this.form['completed'].checked,
                description: this.form['description'].value
            };

            if (isUpdate) {
                Object.assign(this.item, formData);
                await itemService.updateItem(this.item);
            } else {
                this.item = await itemService.addItem(formData);
            }

            if (navigate) {
                this.hideItemForm();
            } else {
                this.setFormForEdit();
            }
        }
    }

    async createItem(navigate) {
        await this.handleItemAction(navigate, false);
    }

    async updateItem(navigate) {
        await this.handleItemAction(navigate, true);
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
        this.btnAddInBackground.innerHTML = "Add in Background";
        this.btnAdd.dataset.action = "addItem";
        this.btnAdd.innerHTML = "Add";
    }

    checkFormValues() {
        this.form.reportValidity();
        return this.form['title'].value.length > 0 && this.form['importance'].value.length > 0 && this.form['importance'].value <= 5;
    }

    updateSortSymbols(orderBy) {
        document.querySelectorAll('.sortSymbol').forEach(el => el.className = 'sortSymbol');
        const btn = document.getElementById(`btn${orderBy.charAt(0).toUpperCase() + orderBy.slice(1)}`);
        btn.className = `sortSymbol ${itemService.currentSortOrder.desc ? 'desc' : 'asc'}`;
    }

    async handleBtnContainerClick(event) {
        switch (event.target.id) {
            case 'newItem':
                this.resetForm();
                this.showItemForm();
                break;
            case 'toggleFilter':
                await itemService.toggleFilter();
                this.showReminders();
                break;
            case 'toggleStyle':
                document.body.classList.toggle('dark-theme');
                break;
            default:
                if (event.target.dataset.orderBy) {
                    itemService.itemSorted(event.target.dataset.orderBy);
                    this.updateSortSymbols(event.target.dataset.orderBy);
                    this.showReminders();
                }
        }
    }

    handleItemContainerClick(event) {
        const id = Number(event.target.dataset.itemId);
        if (!isNaN(id)) {
            this.editItem(itemService.items.find(item => item.id === id));
        }
    }

    async handleFormContainerClick(event) {
        if (event.target.tagName === 'BUTTON') {
            const action = event.target.dataset.action;
            if (event.target === this.btnAddInBackground) {
                action === 'addItem' ? this.createItem(false) : this.updateItem(false);
            } else if (event.target === this.btnAdd) {
                action === 'addItem' ? this.createItem(true) : this.updateItem(true);
            } else if (event.target.id === 'btnDelete') {
                await this.deleteItem(true);
            } else {
                this.hideItemForm();
            }
        }
    }

    initEventHandlers() {
        this.btnContainer.addEventListener('click', this.handleBtnContainerClick.bind(this));
        this.itemContainer.addEventListener('click', this.handleItemContainerClick.bind(this));
        this.formContainer.addEventListener('click', this.handleFormContainerClick.bind(this));
    }

    async initialize() {
        this.initEventHandlers();
        await itemService.loadData();
        this.showReminders();
    }
}

new RemindersController().initialize();
