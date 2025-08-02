const express = require('express');
const planoGroupRoute = require('../routers/planoGroupRoute');
const infoRoute = require('../routers/infoRoute');

const router = express.Router();

router.use('/planogroup', planoGroupRoute);
router.use('/', infoRoute);

module.exports = router;
