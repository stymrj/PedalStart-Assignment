const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let tasks = [];
let nextTaskId = 1;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to your Task Management Application!');
});

// Retrieve all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  const newTask = { id: nextTaskId++, title, description, dueDate };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Retrieve a single task by its ID
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, dueDate } = req.body;
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { id: taskId, title, description, dueDate };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
