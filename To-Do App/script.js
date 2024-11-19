document.addEventListener("DOMContentLoaded", () => {
  // Select DOM elements
  const todoForm = document.getElementById("todo-form");
  const tasksTable = document
    .getElementById("tasks-table")
    .querySelector("tbody");
  const completedTasksTable = document
    .getElementById("completed-tasks-table")
    .querySelector("tbody");
  const taskProgress = document.getElementById("task-progress");
  const searchInput = document.getElementById("search-tasks");
  const themeToggle = document.getElementById("theme-toggle");

  let tasks = [];
  let completedTasks = [];

  // Load tasks from local storage
  loadTasksFromLocalStorage();

  // Load Dark Mode Preference
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }

  // Render tasks initially
  renderTasks();
  renderCompletedTasks();
  updateProgress();

  // Save Task Handler
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("task-category").value;

    if (title && description) {
      const newTask = {
        id: Date.now(),
        title,
        description,
        category,
        dateAdded: new Date().toLocaleString(),
      };
      tasks.push(newTask);
      saveTasksToLocalStorage();
      renderTasks();
      updateProgress();
      todoForm.reset();
    }
  });

  // Render Tasks
  function renderTasks(filter = "") {
    tasksTable.innerHTML = "";
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredTasks.length === 0) {
      tasksTable.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No tasks found</td></tr>`;
    } else {
      filteredTasks.forEach((task) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${task.title}</td>
          <td>${task.description}</td>
          <td><span class="badge bg-${getCategoryBadge(
            task.category
          )}">${capitalize(task.category)}</span></td>
          <td>${task.dateAdded}</td>
          <td>
            <button class="btn btn-complete btn-sm" data-action="complete" data-id="${
              task.id
            }"><i class="fas fa-check"></i></button>
            <button class="btn btn-edit btn-sm" data-action="edit" data-id="${
              task.id
            }"><i class="fas fa-edit"></i></button>
            <button class="btn btn-delete btn-sm" data-action="delete" data-id="${
              task.id
            }"><i class="fas fa-trash"></i></button>
          </td>
        `;
        tasksTable.appendChild(row);
      });
    }
  }

  // Render Completed Tasks
  function renderCompletedTasks(filter = "") {
    completedTasksTable.innerHTML = "";
    const filteredCompletedTasks = completedTasks.filter((task) =>
      task.title.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredCompletedTasks.length === 0) {
      completedTasksTable.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No completed tasks found</td></tr>`;
    } else {
      filteredCompletedTasks.forEach((task) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${task.title}</td>
          <td>${task.description}</td>
          <td><span class="badge bg-${getCategoryBadge(
            task.category
          )}">${capitalize(task.category)}</span></td>
          <td>${task.dateAdded}</td>
          <td>
            <button class="btn btn-delete btn-sm" data-action="delete-completed" data-id="${
              task.id
            }"><i class="fas fa-trash"></i></button>
          </td>
        `;
        completedTasksTable.appendChild(row);
      });
    }
  }

  // Event Delegation for Task Actions
  document.body.addEventListener("click", (e) => {
    const actionButton = e.target.closest("button");
    if (!actionButton) return; // If no button clicked, do nothing

    const action = actionButton.dataset.action;
    const id = parseInt(actionButton.dataset.id);

    if (action === "complete") completeTask(id);
    if (action === "edit") editTask(id);
    if (action === "delete") deleteTask(id);
    if (action === "delete-completed") deleteCompletedTask(id);
  });

  // Complete Task
  function completeTask(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex > -1) {
      const completedTask = { ...tasks[taskIndex] };
      completedTasks.push(completedTask);
      tasks.splice(taskIndex, 1);
      saveTasksToLocalStorage();
      renderTasks();
      renderCompletedTasks();
      updateProgress();
    }
  }

  // Edit Task
  function editTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      document.getElementById("title").value = task.title;
      document.getElementById("description").value = task.description;
      document.getElementById("task-category").value = task.category;
      deleteTask(id); // Temporarily delete the task to allow editing
    }
  }

  // Delete Task
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasksToLocalStorage();
    renderTasks();
    updateProgress();
  }

  // Delete Completed Task
  function deleteCompletedTask(id) {
    completedTasks = completedTasks.filter((task) => task.id !== id);
    saveTasksToLocalStorage();
    renderCompletedTasks();
  }

  // Save tasks to local storage
  function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }

  // Load tasks from local storage
  function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem("tasks");
    const savedCompletedTasks = localStorage.getItem("completedTasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    completedTasks = savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
  }

  // Update Progress Bar
  function updateProgress() {
    const totalTasks = tasks.length + completedTasks.length;
    const completed = completedTasks.length;
    const percentage = totalTasks === 0 ? 0 : (completed / totalTasks) * 100;
    taskProgress.style.width = `${percentage}%`;
    taskProgress.textContent = `${Math.round(percentage)}% Completed`;
  }

  // Helpers
  function getCategoryBadge(category) {
    switch (category) {
      case "work":
        return "primary";
      case "personal":
        return "info";
      case "urgent":
        return "danger";
      default:
        return "secondary";
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Dark Mode Toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save the dark mode preference in localStorage
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
  });
});
