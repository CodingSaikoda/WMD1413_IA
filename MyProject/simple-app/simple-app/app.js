const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above.</li>';
    taskCount.textContent = '0 tasks';
    return;
  }

  const completedCount = tasks.filter((task) => task.done).length;
  taskCount.textContent = `${tasks.length} tasks • ${completedCount} done`;

  taskList.innerHTML = tasks
    .map(
      (task) => `
        <li class="task-item ${task.done ? 'done' : ''}">
          <label class="task-main">
            <input class="checkbox" type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}" />
            <span class="task-text">${task.text}</span>
          </label>
          <button class="delete-btn" type="button" data-id="${task.id}">Delete</button>
        </li>
      `
    )
    .join('');
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.unshift({ id: Date.now().toString(), text: trimmed, done: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(taskInput.value);
  taskForm.reset();
  taskInput.focus();
});

taskList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (button) {
    deleteTask(button.dataset.id);
  }
});

taskList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('input[type="checkbox"][data-id]');
  if (checkbox) {
    toggleTask(checkbox.dataset.id);
  }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

renderTasks();
