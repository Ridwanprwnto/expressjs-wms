const express = require('express');
const { getServerInfo } = require('../../controllers/serverInfoController');

const infoRoute = express.Router();

infoRoute.get('/', getServerInfo);

module.exports = infoRoute;