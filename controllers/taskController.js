// Handles task CRUD operations (to be implemented)
const Task = require('../models/Task');

const redisClient = require('../config/redis');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        const task = new Task({ title, description, status, priority, user: req.user.id });
        await task.save();
        await redisClient.del('tasks'); // Clear cache
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get tasks with pagination & filtering
exports.getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, priority, status } = req.query;
        const cacheTasks = await redisClient.get('tasks');
        
        if (cacheTasks) return res.json(JSON.parse(cacheTasks));
        
        let filter = {};
        if (priority) filter.priority = priority;
        if (status) filter.status = status;
        
        const tasks = await Task.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ priority: -1, createdAt: -1 });
        
        await redisClient.set('tasks', JSON.stringify(tasks), { EX: 60 }); // Cache for 60s
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        await redisClient.del('tasks'); // Clear cache
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        await redisClient.del('tasks'); // Clear cache
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
