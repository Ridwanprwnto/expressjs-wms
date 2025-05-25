// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routers/authRoutes');
const { logger, logInfo, logError } = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    res.setHeader('X-Powered-By', 'Express');
    next();
});

app.get('/api/info', (req, res) => {
    const serverInfo = {
        webServer: process.env.WEB_SERVER || 'Express',
        backendVersion: require('../package.json').dependencies.express,
        nodeVersion: process.version
    };
    logInfo('API /api/info diakses');
    res.json(serverInfo);
});

const domainsFromEnv = process.env.CORS_DOMAINS || "";
const whitelist = domainsFromEnv.split(",").map(item => item.trim());

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            logger.error(`CORS error: ${origin} is not allowed`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    logInfo(`Server is running on port ${PORT}`);
});