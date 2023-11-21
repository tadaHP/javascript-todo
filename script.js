let list = document.getElementById("list");
let createButton = document.getElementById("create-todo");

let todos = [];

createButton.addEventListener('click', createNewTodo);

function createNewTodo() {
    const item ={
        id: new Date().getTime(),
        text: '',
        complete: false
    }

    todos.unshift(item);

    const {todoItem, textItem, editItem, removeItem} = createTodoElement(item);
    list.prepend(todoItem)

    textItem.removeAttribute("disabled");
    textItem.focus();
    saveToLocalStorage();
}

function createTodoElement(item) {
    let todoItem = document.createElement('div');
    todoItem.classList.add('item');

    function makeCheckboxElement() {
        let checkboxItem = document.createElement('input');
        checkboxItem.type = 'checkbox';
        checkboxItem.checked = item.complete;

        checkboxItem.addEventListener('change', () => {
            item.complete = checkboxItem.checked;
            if (item.complete) {
                todoItem.classList.add('complete');
            } else {
                todoItem.classList.remove('complete');
            }
            saveToLocalStorage();
        });

        if (item.complete) {
            todoItem.classList.add('complete');
        }
        return checkboxItem;
    }


    function makeTextElement() {
        let textItem = document.createElement('input');
        textItem.type = 'text';
        textItem.value = item.text;
        textItem.setAttribute('disabled', '');

        textItem.addEventListener('input', () => {
            item.text = textItem.value;
        });

        textItem.addEventListener('blur', () => {
            textItem.setAttribute("disabled", "")
            saveToLocalStorage();
        });
        return textItem;
    }

    function makeActionContainer() {
        let actionItemContainer = document.createElement('div');
        actionItemContainer.classList.add('actions');

        let editElement = document.createElement('button');
        editElement.classList.add('material-icons');
        editElement.innerText = 'edit';

        editElement.addEventListener('click', () => {
            textElement.removeAttribute("disabled");
            textElement.focus();
        });

        let removeElement = document.createElement('button');
        removeElement.classList.add('material-icons', 'remove-btn')
        removeElement.innerText = 'remove_circle'

        removeElement.addEventListener('click', () => {
            todos = todos.filter(t => t.id !== item.id);
            todoItem.remove();
            saveToLocalStorage();
        });
        return {actionItemContainer, editElement, removeElement};
    }

    let checkBoxElement = makeCheckboxElement();
    let textElement = makeTextElement();
    let {actionItemContainer, editElement, removeElement} = makeActionContainer();

    todoItem.append(checkBoxElement);
    todoItem.append(textElement);

    actionItemContainer.append(editElement);
    actionItemContainer.append(removeElement);

    todoItem.append(actionItemContainer);
    return {todoItem, textElement, editElement, removeElement}
}

function saveToLocalStorage() {
    const dataToJson = JSON.stringify(todos);

    this.localStorage.setItem('my_todos', dataToJson);
}

(function displaySavedTodo() {
    loadFromLocalStorage();

    for (let i = 0; i < todos.length; i++) {
        const item = todos[i];
        const {todoItem} = createTodoElement(item);

        list.append(todoItem);
    }
})()

function loadFromLocalStorage() {
    const data = this.localStorage.getItem('my_todos');

    if (data) {
        todos = JSON.parse(data);
    }
}