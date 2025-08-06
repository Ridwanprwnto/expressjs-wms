const express = require('express');
const modulePlano = require('./modules/planogroup.route');

const mainRouter  = express.Router();

mainRouter.use('/planogroup', modulePlano);

module.exports = mainRouter ;
