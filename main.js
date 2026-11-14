document.addEventListener("DOMContentLoaded", function () {
    const topButton = document.getElementById("top");
    const darkModeButton = document.getElementById("darkMode");

    if (topButton) {
        topButton.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    if (darkModeButton) {
        darkModeButton.addEventListener("click", function () {
            document.body.classList.toggle("light-mode");

            if (document.body.classList.contains("light-mode")) {
                darkModeButton.textContent = "Switch to Dark Mode";
            } else {
                darkModeButton.textContent = "Switch to Light Mode";
            }
        });
    }
});
// ======================================
// TASK TRACKER - FRONT-END JAVASCRIPT
// ======================================

function initTaskTracker() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskMessage = document.getElementById('task-message');

    const API_URL = '/api/tasks';

    // Show a status or error message to the user
    function showTaskMessage(message) {
        taskMessage.textContent = message;
    }

    // GET: Retrieve tasks from the Express API
    async function loadTasks() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Unable to load tasks.');
            }

            const tasks = await response.json();
            displayTasks(tasks);
        } catch (error) {
            showTaskMessage(error.message);
        }
    }

    // Build the visible task list
    function displayTasks(tasks) {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            const message = document.createElement('li');
            message.textContent = 'No tasks have been added.';
            taskList.appendChild(message);
            return;
        }

        tasks.forEach(task => {
            const listItem = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                'aria-label',
                `Mark ${task.title} as complete`
            );

            // textContent shows the title as plain text, never as HTML
            const taskText = document.createElement('span');
            taskText.textContent = task.title;

            if (task.completed) {
                taskText.style.textDecoration = 'line-through';
            }

            checkbox.addEventListener('change', () => {
                updateTask(task.id, checkbox.checked);
            });

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute(
                'aria-label',
                `Delete ${task.title}`
            );

            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(taskText);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });
    }

    // POST: Send a new task to the API
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = taskInput.value.trim();

        if (!title) {
            showTaskMessage('Please enter a task.');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title })
            });

            if (!response.ok) {
                throw new Error('Unable to add task.');
            }

            taskInput.value = '';
            showTaskMessage('Task added successfully.');
            await loadTasks();
        } catch (error) {
            showTaskMessage(error.message);
        }
    });

    // PUT: Update a task's completion status
    async function updateTask(id, completed) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: completed })
            });

            if (!response.ok) {
                throw new Error('Unable to update task.');
            }

            showTaskMessage('Task updated successfully.');
            await loadTasks();
        } catch (error) {
            showTaskMessage(error.message);
            await loadTasks();
        }
    }

    // DELETE: Remove a task
    async function deleteTask(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Unable to delete task.');
            }

            showTaskMessage('Task deleted successfully.');
            await loadTasks();
        } catch (error) {
            showTaskMessage(error.message);
        }
    }

    // Load saved tasks when the page opens
    loadTasks();
}

// Run only on pages that contain the Task Tracker section
if (document.getElementById('task-tracker')) {
    initTaskTracker();
}




