// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const services = require('./services');
const { logger, logInfo } = require('./utils/logger');
const setupCors = require('./middleware/corsConfig');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    res.setHeader('X-Powered-By', 'Express');
    next();
});

// Middleware: CORS
app.use(setupCors());

// Middleware: JSON Parser
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Root static page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(process.env.PATH_API, services);

app.listen(PORT, () => {
    logInfo(`Server is running on port ${PORT}`);
});
