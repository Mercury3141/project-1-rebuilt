export class ItemTemplate {

    createItemHtml(item) {
        function insertSymbols(amount) {
            const symbol = '!';
            return symbol.repeat(amount);
        }

        function calculateDaysUntil(dueDate) {
            if (!dueDate) return 'someday';

            const today = new Date();
            const dueDateObj = new Date(dueDate);
            const timeDiff = dueDateObj - today;
            const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            if (dayDiff > 0) {
                return `in ${dayDiff} days`;
            } else if (dayDiff === 0) {
                return 'today';
            } else {
                return `${Math.abs(dayDiff)} days ago`;
            }
        }

        if (item.length === 0) {
            return `<div class="no-item">No Reminder found</div>`;
        }

        return item.map(item => `
            <div class="item-entry">
                <div class="duedate">${calculateDaysUntil(item.duedate)}</div>
                <div class="title">${item.title}</div>
                <div class="importance">${insertSymbols(item.importance)}</div>
                <div class="completed"><input type="checkbox" disabled ${item.isCompleted ? 'checked' : ''}>${item.isCompleted ? 'Completed' : 'Open'}</div>
                <div class="description">${item.description}</div>                
                <button class="edit" type="button" data-item-id="${item.id}">Edit</button>
            </div>`).join('');
    }
}

export const itemTemplate = new ItemTemplate();