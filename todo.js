// Select DOM elements
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const clearAllBtn = document.getElementById("clear-all");

let tasks = []; // { id, text, completed }

// Load tasks from localStorage when page loads
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("todo-tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach((task) => addTaskToDOM(task));
    updateTaskCount();
  }
});

// Handle form submit (Add button or Enter key)
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  addTaskToDOM(newTask);

  todoInput.value = "";
  todoInput.focus();
  updateTaskCount();
});

// Add single task element to DOM
function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.className = "todo-item";
  if (task.completed) {
    li.classList.add("completed");
  }
  li.dataset.id = task.id;

  const leftDiv = document.createElement("div");
  leftDiv.className = "left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = task.text;

  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "❌";

  li.appendChild(leftDiv);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);

  // Checkbox event
  checkbox.addEventListener("change", () => {
    toggleTask(task.id, checkbox.checked, li);
  });

  // Delete button event
  deleteBtn.addEventListener("click", () => {
    deleteTask(task.id, li);
  });
}

// Toggle completed status
function toggleTask(id, isCompleted, listItem) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: isCompleted } : task
  );
  if (isCompleted) {
    listItem.classList.add("completed");
  } else {
    listItem.classList.remove("completed");
  }
  saveTasks();
  updateTaskCount();
}

// Delete task
function deleteTask(id, listItem) {
  tasks = tasks.filter((task) => task.id !== id);
  todoList.removeChild(listItem);
  saveTasks();
  updateTaskCount();
}

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
  if (!tasks.length) return;

  const confirmClear = confirm("Delete all tasks?");
  if (!confirmClear) return;

  tasks = [];
  todoList.innerHTML = "";
  saveTasks();
  updateTaskCount();
});

// Save to localStorage
function saveTasks() {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

// Update footer count
function updateTaskCount() {
  const remaining = tasks.filter((task) => !task.completed).length;
  const total = tasks.length;

  if (!total) {
    taskCount.textContent = "No tasks";
  } else {
    taskCount.textContent = `${remaining} of ${total} tasks left`;
  }
}
