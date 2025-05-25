const express = require('express');
const { 
    checkItemController, 
    checkZonaRakController, 
    checkLineRakController, 
    checkGroupRakController 
} = require('../controllers/authController');
const router = express.Router();

router.post('/tablokplano', checkItemController);
router.post('/zonarak', checkZonaRakController);
router.post('/linerak', checkLineRakController);
router.post('/grouprak', checkGroupRakController);

module.exports = router;