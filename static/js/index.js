let currTab = 'All';

const readTodoList = () => JSON.parse(localStorage.getItem('todo_list'));
const updateTodoList = (todoList) => {localStorage.setItem('todo_list', JSON.stringify(todoList))};

const createTodo = (task) => {
    const todoList = readTodoList();
    const id = parseInt(localStorage.getItem('todo_id'));
    todoList.push({'completed': false, 'task': task, 'id': id});
    localStorage.setItem('todo_id', id + 1);
    updateTodoList(todoList);
    return id;
}

const updateTodo = (todoId) => {
    const todoList = readTodoList();
    const todo = todoList.find((todo) => todo.id === todoId);
    todo.completed = !todo.completed;
    updateTodoList(todoList);
    return todo.completed;
}

const deleteTodo = (todoId) => {
    let todoList = readTodoList();
    todoList = todoList.filter((todo) => todo.id !== todoId);
    updateTodoList(todoList);
}

const renderTodo = (todo) => {
    const li = document.createElement('li');
    li.className = (todo.completed? 'completed' : 'active') + '-todo';
    const todosUl = document.getElementById('todos');
    
    const checkbox = document.createElement('input');
    checkbox.className = 'check-completed';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed? true : false;
    checkbox.addEventListener('change', function () {
        const status = updateTodo(todo.id);
        if (currTab === 'All') {
            this.parentElement.className = (status? 'completed' : 'active') + '-todo';
        }
        else {
            todosUl.removeChild(this.parentElement);
        }
    })
    li.appendChild(checkbox);

    const task = document.createTextNode(todo.task);
    li.appendChild(task);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-del';
    deleteBtn.innerHTML = '&#10005;';
    deleteBtn.addEventListener('click', function () {
        deleteTodo(todo.id);
        todosUl.removeChild(this.parentElement);
    })
    li.appendChild(deleteBtn);

    return li;
}

document.getElementById('form').onsubmit = function(event) {
    event.preventDefault();
    const newTodo = document.getElementById('new-todo');
    const task = newTodo.value.trim();
    if (task === '') {
        alert('Todo cannot be empty');
        return;
    }
    newTodo.value = '';
    const todoId = createTodo(task);
    if (currTab !== 'Completed') {
        const todo = {'completed': false, 'task': task, 'id': todoId};
        const li = renderTodo(todo);
        const todosUl = document.getElementById('todos');
        todosUl.insertBefore(li, todosUl.firstChild);
    }
}

const renderTodoList = (todoList) => {
    const todosUl = document.getElementById('todos');
    todosUl.innerHTML = '';
    let todo, li;
    for (todo of todoList) {
        li = renderTodo(todo);
        todosUl.appendChild(li);
    }
}

const filterTodoList = (tab) => {
    let todoList = readTodoList();
    if (tab === 'Active') {
        todoList = todoList.filter((todo) => !todo.completed);
    }
    else if (tab === 'Completed') {
        todoList = todoList.filter((todo) => todo.completed);
    }
    return todoList;
}

const changeTab = (tab) => {
    currTab = tab;
    const todoList = filterTodoList(tab);
    todoList.reverse();
    renderTodoList(todoList);
}

const resetDB = () => {
    localStorage.setItem('todo_list', JSON.stringify([]));
    localStorage.setItem('todo_id', 1);
    document.getElementById('todos').innerHTML = '';
    changeTab('All');
}


if (readTodoList() === null || localStorage.getItem('todo_id') === null) {
    resetDB();
}

