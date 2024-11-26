// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let currentTodoId = null;
let oldInputValue;

// Funções
const saveTodo = async (text, done = false, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="bi bi-check-square-fill"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
  todo.appendChild(deleteBtn);

  // Adiciona o elemento na lista
  todoList.appendChild(todo);
  todoInput.value = "";  // Limpa o campo de input

  if (save) {
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: text,
          done: done,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Tarefa salva com sucesso na API', result);

        todo.setAttribute('data-id', result.id);
        console.log('ID atribuído ao todo:', result.id);
      } else {
        console.error('Erro ao salvar a tarefa na API');
      }
    } catch (error) {
      console.error('Erro de conexão com a API', error);
    }
  } else {
    saveTodoLocalStorage({ text, done });
  }
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodoStatus = async (todoId, currentStatus) => {
  try {
    const newStatus = currentStatus === true ? false : true;

    const response = await fetch(`http://localhost:3000/tasks/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        done: newStatus, 
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar o status da tarefa');
    }

    console.log(`Status da tarefa atualizado para ${newStatus ? 'concluída' : 'não concluída'} com sucesso`);
    
  } catch (error) {
    console.error('Erro ao se conectar à API para atualizar o status da tarefa', error);
  }
};

const updateTodoDescription = async (todoId, description) => {
  try{
    const response = await fetch(`http://localhost:3000/tasks/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        description: editInput.value,
      }),
    });

    if(!response.ok){
      throw new Error('Erro ao atualizar descrição da tarefa');
    }

    console.log('Descrição da tarefa atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao se conectar à API para atualizar a descrição da tarefa', error);
  }
}

const handleStatusUpdate = (todoElement) => {
  const id = todoElement.getAttribute('data-id');

  console.log(`ID da tarefa: ${id}`);

  const currentStatus = todoElement.classList.contains('done');
  const todoText = todoElement.querySelector('h3').innerText;

  updateTodo(id, todoText, currentStatus);

  todoElement.classList.toggle('done');
}


const getAllTodos = async () => {
  try {
    todoList.innerHTML = '';

    const response = await fetch('http://localhost:3000/tasks');

    if (!response.ok) {
      throw new Error('Erro ao buscar tarefas do banco de dados');
    }
    const todos = await response.json();

    return todos;

  } catch (error) {
    console.error('Erro ao buscar tarefas', error);
    return [];
  }
}


const getSearchedTodos = async (search) => {
  try{
    const response = await fetch(`http://localhost:3000/tasks?search=${search}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar tarefas');
    }

    const todos = await response.json();

    const todoList = document.querySelector("#todo-list");
    todoList.innerHTML = '';

    todos.forEach((todo) => {
      const todoTitle = todo.description.toLowerCase();

      if (todoTitle.includes(search.toLowerCase())) {
        const todoElement = document.createElement("div");
        todoElement.classList.add ("todo");

        const todoTitleElement = document.createElement("h3");
        todoTitleElement.innerText = todo.description;
        todoElement.appendChild(todoTitleElement);

        todoList.appendChild(todoElement);
      }
    })
  } catch (error) {
    console.log("Erro ao buscar tarefas", error);
  }
};

const deleteTodos = async (todoId) => {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${todoId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Tarefa removida com sucesso');
    } else {
      console.error('Erro ao remover a tarefa');
    }
  } catch (error) {
    console.error('Erro ao se conectar a API para remover tarefa', error);
  }
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));

      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;
  let todoId;

  if (parentEl) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
    todoId = parentEl.getAttribute('data-id');
    console.log(`ID da tarefa ${todoId}`)
  }
  
  if (targetEl.classList.contains("finish-todo")) {
    const currentStatus = parentEl.classList.contains("done");
    const todoId = parentEl.getAttribute('data-id');

    updateTodoStatus(todoId, currentStatus)

    if (!currentStatus) {
      parentEl.classList.add('done');
    } else {
      parentEl.classList.remove('done');
    }
  }

  if (targetEl.classList.contains("remove-todo")) {
    const todoId = parentEl.getAttribute('data-id');
    parentEl.remove();

    deleteTodos(todoId);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    currentTodoId = todoId;
    editInput.value = todoTitle;
    oldInputValue = todoTitle;

    console.log(currentTodoId)
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  const todoTitle = document.querySelector('h3');

  if (editInputValue) {
    await updateTodoDescription(currentTodoId, editInputValue);
    todoTitle.innerHTML = editInputValue;
  }

  toggleForms();

  loadTodos();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});



const loadTodos = async () => {
  const todos = await getAllTodos();

  todos.forEach((todo) => {
    const todoElement = document.createElement("div");
    todoElement.classList.add("todo");

    // Adiciona o ID retornado da API ao data-id do elemento
    todoElement.setAttribute('data-id', todo.id);

    const todoTitleElement = document.createElement("h3");
    todoTitleElement.innerText = todo.description;
    todoElement.appendChild(todoTitleElement);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="bi bi-check-square-fill"></i>';
    todoElement.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
    todoElement.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    todoElement.appendChild(deleteBtn);

    todoList.appendChild(todoElement);

    if (todo.done) {
      todoElement.classList.add('done');
    }
  });
};


const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();