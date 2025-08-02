// routers/infoRoute.js
const express = require('express');
const getServerInfo = require('../handlers/serverInfo');

const router = express.Router();

router.get('/info', getServerInfo);

module.exports = router;
