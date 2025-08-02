const express = require('express');
const { 
    checkItemController, 
    checkZonaRakController, 
    checkLineRakController, 
    checkGroupRakController 
} = require('../controllers/planoGroupController');
const planoGroupRoute = express.Router();

planoGroupRoute.post('/tablokplano', checkItemController);
planoGroupRoute.post('/zonarak', checkZonaRakController);
planoGroupRoute.post('/linerak', checkLineRakController);
planoGroupRoute.post('/grouprak', checkGroupRakController);

module.exports = planoGroupRoute;