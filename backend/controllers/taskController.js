const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'medium',
      assignedTo: assignedTo || null,
      createdBy: req.user._id
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('createTask error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const assignedOnly = req.query.assignedOnly === 'true';
    const filter = {};
    if (assignedOnly) filter.assignedTo = req.user._id;
    if (!req.user.isAdmin && !assignedOnly) {
      filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assignedTo', 'name email');

    res.json({ tasks, page, limit, total });
  } catch (err) {
    console.error('listTasks error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!req.user.isAdmin && (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString()) && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(task);
  } catch (err) {
    console.error('getTask error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!req.user.isAdmin && task.createdBy.toString() !== req.user._id.toString() && (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title, description, dueDate, priority, assignedTo } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('updateTask error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const confirm = req.query.confirm === 'true';
    if (!confirm) return res.status(400).json({ message: 'Deletion not confirmed' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!req.user.isAdmin && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await task.deleteOne();   // 👈 FIXED

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('deleteTask error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!['pending', 'in-progress', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('updateStatus error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!['low', 'medium', 'high'].includes(priority)) return res.status(400).json({ message: 'Invalid priority' });
    task.priority = priority;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('updatePriority error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  updateStatus,
  updatePriority
};
