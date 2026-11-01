const express = require('express');
const { checkTTDRetokController } = require('../../controllers/ttdRetokController');

const ttdRetokRoute = express.Router();

ttdRetokRoute.post('/checkttd', checkTTDRetokController);

module.exports = ttdRetokRoute;