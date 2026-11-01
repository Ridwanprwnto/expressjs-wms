const express = require('express');
const modulePlano = require('./modules/planogroup.route');
const moduleRetok = require('./modules/returtoko.route');

const mainRouter  = express.Router();

mainRouter.use('/planogroup', modulePlano);
mainRouter.use('/returtoko', moduleRetok);

module.exports = mainRouter ;
