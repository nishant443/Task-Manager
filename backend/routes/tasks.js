const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// Create task
router.post('/', auth, taskController.createTask);

// List tasks with pagination. If ?assignedOnly=true, only return tasks assigned to logged-in user.
router.get('/', auth, taskController.listTasks);

// Get task details
router.get('/:id', auth, taskController.getTask);

// Update task (edit details)
router.put('/:id', auth, taskController.updateTask);

// Delete task. For simplicity require confirm=true query param from frontend to avoid accidental deletes.
router.delete('/:id', auth, taskController.deleteTask);

// Update status
router.patch('/:id/status', auth, taskController.updateStatus);

// Update priority
router.patch('/:id/priority', auth, taskController.updatePriority);

module.exports = router;
