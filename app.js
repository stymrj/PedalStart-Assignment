document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Function to fetch all tasks from the backend
    function fetchTasks() {
        fetch('https://pedalstart-production.up.railway.app/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = ''; // Clear the list before adding tasks
                tasks.forEach(task => {
                    const taskElement = createTaskElement(task);
                    taskList.appendChild(taskElement);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Function to create a task element
    function createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.id = `task-${task.id}`;
        taskDiv.innerHTML = `
            <strong>${task.title}</strong> (Due: ${task.dueDate})
            <div class="task-details">
                ${task.description}
            </div>
            <div class="task-actions">
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        return taskDiv;
    }

    // Function to handle adding a new task
    function handleAddTask(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;

        // Create task object
        const newTask = { title, description, dueDate };

        // POST request to add a new task
        fetch('https://pedalstart-production.up.railway.app/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        })
            .then(response => response.json())
            .then(createdTask => {
                const taskElement = createTaskElement(createdTask);
                taskList.appendChild(taskElement);
                taskForm.reset(); // Clear form fields
            })
            .catch(error => console.error('Error adding task:', error));
    }

    // Function to delete a task
    window.deleteTask = function(taskId) {
        fetch(`https://pedalstart-production.up.railway.app/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then(() => {
                fetchTasks(); // Refresh the task list
            })
            .catch(error => console.error('Error deleting task:', error));
    };

    // Function to edit a task
    window.editTask = function(taskId) {
        const taskElement = document.getElementById(`task-${taskId}`);
        const title = taskElement.querySelector('strong').textContent;
        const description = taskElement.querySelector('.task-details').textContent.trim();
        const dueDate = taskElement.textContent.split(' (Due: ')[1].split(')')[0];

        document.getElementById('title').value = title;
        document.getElementById('description').value = description;
        document.getElementById('dueDate').value = dueDate;

        taskForm.onsubmit = function(event) {
            handleEditTask(event, taskId);
        };
    };

    // Function to handle editing a task
    function handleEditTask(event, taskId) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;

        // Update task object
        const updatedTask = { title, description, dueDate };

        // PUT request to update the task
        fetch(`https://pedalstart-production.up.railway.app/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        })
            .then(response => response.json())
            .then(updatedTask => {
                fetchTasks(); // Refresh the task list
                taskForm.reset(); // Clear form fields
                taskForm.onsubmit = handleAddTask; // Reset the form to add new tasks
            })
            .catch(error => console.error('Error updating task:', error));
    }

    // Initial setup
    taskForm.onsubmit = handleAddTask;
    fetchTasks(); // Fetch tasks on page load
});
