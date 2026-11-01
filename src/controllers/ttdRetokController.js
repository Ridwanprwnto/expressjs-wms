const { checkTTDRetokModel } = require('../models/ttdRetokModel');
const { logInfo, logError } = require('../utils/logger');

const checkTTDRetokController = async (req, res) => {
    const { nrb, tgl, store } = req.body;

    try {
        if (!nrb || !tgl || !store) {
            logError('NRB, date, and store header are required');
            return res.status(400).json({ error: 'NRB, date, and store are required' });
        }
        const response = await checkTTDRetokModel(nrb, tgl, store);
        if (!response || response === 0) {
            logInfo('No data found for checkTTDRetokController');
            return res.status(400).json({ error: 'No data found' });
        }
        logInfo('Data found for checkTTDRetokController');
        res.status(200).json(response);
    } catch (error) {
        logError(`Error in checkTTDRetokController: ${error.message}`);
        res.status(500).json({ message: 'Error read TTD Retok data' });
    }
};

module.exports = { 
    checkTTDRetokController
};
