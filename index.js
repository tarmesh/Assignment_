const express = require('express');
const mongoose = require('./config/db');
const redisClient = require('./config/redis');
const authRoutes = require('./middleware/routes/authRoutes');
const taskRoutes = require('./middleware/routes/taskRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
