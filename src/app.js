const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/user', userRoutes);

// Catch-all route handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
  });

module.exports = app;
