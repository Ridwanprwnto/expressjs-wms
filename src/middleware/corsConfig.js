// middleware/corsConfig.js
const cors = require('cors');
const { logger } = require('../utils/logger');

const setupCors = () => {
    const whitelist = (process.env.CORS_DOMAINS || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return cors({
        origin(origin, callback) {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                logger.error(`CORS error: ${origin} is not allowed`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    });
};

module.exports = setupCors;