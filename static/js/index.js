const db = window.localStorage;
const form = document.getElementById('form');
const newTodo = document.getElementById('new-todo');
const todosModel = document.getElementById('todos');
const tabHead = document.getElementById('tab');
let currTab = 'All';
tabHead.innerHTML = currTab + ' todos';

readTodoList = () => JSON.parse(db.getItem('todo_list'));
updateTodoList = (todoList) => {db.setItem('todo_list', JSON.stringify(todoList))};

if (readTodoList() === null || db.getItem('todo_id') === null) {
    resetDB();
}

function resetDB() {
    db.setItem('todo_list', JSON.stringify([]));
    db.setItem('todo_id', 1);
    todosModel.innerHTML = '';
    clickTab('All');
}

function addTodo(task) {
    const todoList = readTodoList();
    const id = parseInt(db.getItem('todo_id'));
    todoList.push({'completed': false, 'task': task, 'id': id});
    db.setItem('todo_id', id + 1);
    updateTodoList(todoList);
    return id;
}

function checkTodo(todoId) {
    const todoList = readTodoList();
    const todo = todoList.find((todo) => todo.id === todoId);
    todo.completed = !todo.completed;
    updateTodoList(todoList);
    return todo.completed;
}

function deleteTodo(todoId) {
    let todoList = readTodoList();
    todoList = todoList.filter((todo) => todo.id !== todoId);
    updateTodoList(todoList);
}

form.onsubmit = function(event) {
    event.preventDefault();
    const task = newTodo.value.trim();
    if (task === '') {
        alert('Todo cannot be empty');
        return;
    }
    newTodo.value = '';
    const todoId = addTodo(task);
    if (currTab !== 'Completed') {
        const todo = {'completed': false, 'task': task, 'id': todoId};
        const li = renderTodo(todo);
        todosModel.insertBefore(li, todosModel.firstChild);
    }
}

function renderTodo(todo) {
    const li = document.createElement('li');
    li.className = (todo.completed? 'completed' : 'active') + '-todo';
    li.setAttribute('todo-id', todo.id);
    
    const checkbox = document.createElement('input');
    checkbox.className = 'check-completed';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed? true : false;
    checkbox.addEventListener('change', function () {
        const status = checkTodo(todo.id);
        if (currTab === 'All') {
            this.parentElement.className = (status? 'completed' : 'active') + '-todo';
        }
        else {
            todosModel.removeChild(this.parentElement);
        }
    })
    li.appendChild(checkbox);

    const task = document.createTextNode(todo.task);
    li.appendChild(task);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.innerHTML = '&cross;';
    deleteBtn.addEventListener('click', function () {
        deleteTodo(todo.id);
        todosModel.removeChild(this.parentElement);
    })
    li.appendChild(deleteBtn);

    return li;
}

function renderTodoList(todoList) {
    todosModel.innerHTML = '';
    let todo, li;
    for (todo of todoList) {
        li = renderTodo(todo);
        todosModel.appendChild(li);
    }
}

function filterTodoList(tab) {
    let todoList = readTodoList();
    if (tab === 'Active') {
        todoList = todoList.filter((todo) => !todo.completed);
    }
    else if (tab === 'Completed') {
        todoList = todoList.filter((todo) => todo.completed);
    }
    return todoList;
}

function clickTab(tab) {
    currTab = tab;
    tabHead.innerHTML = currTab + ' todos';
    const todoList = filterTodoList(tab);
    todoList.reverse();
    renderTodoList(todoList);
}
