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
    const todoList = readTodoList();
    updateTodoList(todoList.filter((todo) => todo.id !== todoId));
}

const getCurrentTabBtn = () => document.getElementsByClassName('btn-nav-curr')[0];

const checkboxChangeListener = (todoId, li) => {
    const status = updateTodo(todoId);
    if (getCurrentTabBtn().innerText === 'All') {
        li.className = (status? 'completed' : 'active') + '-todo';
    } else {
        li.parentElement.removeChild(li);
    }
}

const deleteBtnClickListener = (todoId, li) => {
    deleteTodo(todoId);
    li.parentElement.removeChild(li);
}

const renderTodo = (todo) => {
    const li = document.createElement('li');
    li.className = (todo.completed? 'completed' : 'active') + '-todo';
    
    const checkbox = document.createElement('input');
    checkbox.className = 'check-completed';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed? true : false;
    checkbox.addEventListener('change', function () {
        checkboxChangeListener(todo.id, li);
    })
    li.appendChild(checkbox);

    li.appendChild(document.createTextNode(todo.task));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-del';
    deleteBtn.innerHTML = '&#10005;';
    deleteBtn.addEventListener('click', function () {
        deleteBtnClickListener(todo.id, li);
    })
    li.appendChild(deleteBtn);

    return li;
}

document.getElementById('form').onsubmit = function() {
    event.preventDefault();
    const newTodo = document.getElementById('new-todo');
    const task = newTodo.value.trim();
    if (task === '') {
        alert('Todo cannot be empty');
        return;
    }
    newTodo.value = '';
    const todoId = createTodo(task);
    if (getCurrentTabBtn().innerText !== 'Completed') {
        const li = renderTodo({'completed': false, 'task': task, 'id': todoId});
        const todosUl = document.getElementById('todos');
        todosUl.insertBefore(li, todosUl.firstChild);
    }
}

const renderTodoList = () => {
    const todosUl = document.getElementById('todos');
    todosUl.innerHTML = '';
    let todoList = readTodoList();
    todoList.reverse();
    const currTab = getCurrentTabBtn().innerText;
    if (currTab === 'Active') {
        todoList = todoList.filter((todo) => !todo.completed);
    } else if (currTab === 'Completed') {
        todoList = todoList.filter((todo) => todo.completed);
    }
    let todo;
    for (todo of todoList) {
        todosUl.appendChild(renderTodo(todo));
    }
}

const changeTab = () => {
    const currTabBtn = getCurrentTabBtn();
    const newTabBtn = event.target;
    if (currTabBtn !== newTabBtn) {
        currTabBtn.className = 'btn-nav';
        newTabBtn.className = 'btn-nav-curr';
        renderTodoList();
    }
}

const resetDB = () => {
    localStorage.setItem('todo_list', JSON.stringify([]));
    localStorage.setItem('todo_id', 1);
    document.getElementById('todos').innerHTML = '';
}

const clickReset = () => {if (confirm('Are you sure you want to reset all the data?')) resetDB();}

const initApp = () => {
    if (readTodoList() === null || localStorage.getItem('todo_id') === null) {
        resetDB();
    }
    renderTodoList();
    let btn;
    for (btn of document.getElementById('nav').childNodes) {
        btn.onclick = (btn.innerText === 'Reset')? clickReset : changeTab;
    }
}
