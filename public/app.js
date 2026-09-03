const form = document.querySelector('#todo-form');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const list = document.querySelector('#todo-list');
const statusText = document.querySelector('#status');
const count = document.querySelector('#todo-count');
const template = document.querySelector('#todo-template');

const api = '/api/todos';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function setStatus(message) {
  statusText.textContent = message;
}

function renderTodos(todos) {
  list.innerHTML = '';
  count.textContent = todos.length;

  if (todos.length === 0) {
    setStatus('No todos yet.');
    return;
  }

  setStatus('');

  todos.forEach((todo) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector('input[type="checkbox"]');
    const title = item.querySelector('.edit-title');
    const description = item.querySelector('.edit-description');
    const saveButton = item.querySelector('.save');
    const deleteButton = item.querySelector('.delete');

    item.classList.toggle('done', todo.is_complete);
    checkbox.checked = todo.is_complete;
    title.value = todo.title;
    description.value = todo.description || '';

    checkbox.addEventListener('change', async () => {
      await updateTodo(todo.id, { is_complete: checkbox.checked });
    });

    saveButton.addEventListener('click', async () => {
      await updateTodo(todo.id, {
        title: title.value,
        description: description.value
      });
    });

    deleteButton.addEventListener('click', async () => {
      await deleteTodo(todo.id);
    });

    list.appendChild(item);
  });
}

async function loadTodos() {
  try {
    setStatus('Loading todos...');
    const todos = await request(api);
    renderTodos(todos);
  } catch (error) {
    setStatus(error.message);
  }
}

async function createTodo(event) {
  event.preventDefault();

  try {
    await request(api, {
      method: 'POST',
      body: JSON.stringify({
        title: titleInput.value,
        description: descriptionInput.value
      })
    });

    form.reset();
    await loadTodos();
  } catch (error) {
    setStatus(error.message);
  }
}

async function updateTodo(id, updates) {
  try {
    await request(`${api}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });

    await loadTodos();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteTodo(id) {
  try {
    await request(`${api}/${id}`, {
      method: 'DELETE'
    });

    await loadTodos();
  } catch (error) {
    setStatus(error.message);
  }
}

form.addEventListener('submit', createTodo);
loadTodos();
