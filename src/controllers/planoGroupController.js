const { 
    checkItemTablokModel, 
    checkZonaRakModel, 
    checkLineRakModel, 
    checkGroupRakModel, 
    checkExistingRakModel, 
    insertGroupPlanoModel 
} = require('../models/planoGroupModel');
const { logInfo, logError } = require('../utils/logger');

const checkItemController = async (req, res) => {
    const { office, pluid } = req.body;
    const flag = "Y";
    try {
        if (!office || !pluid) {
            logError('Office code and pluid are required');
            return res.status(400).json({ error: 'Office code and pluid are required' });
        }
        const response = await checkItemTablokModel(office, pluid, flag);
        if (!response || response === 0) {
            logInfo('No data found for checkItem');
            return res.status(400).json({ error: 'No data found' });
        }
        logInfo('Data found for checkItem');
        res.status(200).json(response);
    } catch (error) {
        logError(`Error in checkItemController: ${error.message}`);
        res.status(500).json({ message: 'Error read PLUID' });
    }
};

const checkZonaRakController = async (req, res) => {
    const { tiperak } = req.body;
    const flag = "Y";
    try {
        if (!tiperak) {
            logError('Type rak are required');
            return res.status(400).json({ error: 'Type rak are required' });
        }
        const response = await checkZonaRakModel(tiperak, flag);
        if (!response || response.length <= 0) {
            logInfo('No data found for checkZonaRak');
            return res.status(400).json({ error: 'No data found' });
        }
        logInfo('Data found for checkZonaRak');
        res.status(200).json(response);
    } catch (error) {
        logError(`Error in checkZonaRakController: ${error.message}`)
        res.status(500).json({ message: 'Error read type rak' });
    }
};

const checkLineRakController = async (req, res) => {
    const { tiperak, linerak } = req.body;
    const flag = "Y";
    try {
        if (!tiperak || !linerak) {
            logError('Type or line rak are required');
            return res.status(400).json({ error: 'Type or line rak are required' });
        }
        const response = await checkLineRakModel(tiperak, linerak, flag);
        if (!response || response.length <= 0) {
            logInfo('No data found for checkLineRak');
            return res.status(400).json({ error: 'No data found' });
        }
        logInfo('Data found for checkLineRak');
        res.status(200).json(response);
    } catch (error) {
        logError(`Error in checkLineRakController: ${error.message}`);
        res.status(500).json({ message: 'Error read type rak' });
    }
};

const checkGroupRakController = async (req, res) => {
    const { PLU, IP, OFFICEID, TYPEPLA, LINEPLA, RAK_PLA } = req.body;
    const FLAG = "Y";

    try {
        if (!OFFICEID || !TYPEPLA || !LINEPLA || !RAK_PLA) {
            logError('Office, type, line, and rak are required');
            return res.status(400).json({ error: 'Office, type, line, and rak are required' });
        }

        const results = [];
        
        const transformedLinePLA = Array.isArray(LINEPLA) ? LINEPLA : Object.values(LINEPLA);
        const transformedRakPLA = Array.isArray(RAK_PLA) ? RAK_PLA : Object.values(RAK_PLA).map(item => Array.isArray(item) ? item : [item]);
        
        for (const line of transformedLinePLA) {
            for (const rak of transformedRakPLA) {
                const response = await checkGroupRakModel(OFFICEID, TYPEPLA, line, rak, FLAG);
                if (response && response.length > 0) {
                    results.push(...response);
                }
            }
        }

        if (results.length <= 0) {
            logInfo('No data found for checkGroupRak');
            return res.status(400).json({ error: 'No data found' });
        }

        const modifiedResults = results.map(item => ({
            pla_office: OFFICEID,
            pla_ip: IP,
            pla_fk_pluid: PLU,
            pla_gd_kode: item.pla_gd_kode,
            pla_lok_kode: item.pla_lok_kode,
            pla_fk_lokasiid: item.pla_fk_lokasiid,
            pla_cellid: item.pla_cellid,
            pla_line: item.pla_line,
            pla_rak: item.pla_rak,
            pla_shelf: item.pla_shelf,
            pla_cell: item.pla_cell
        }));

        const existingData = await checkExistingRakModel(modifiedResults);

        const normalizeKey = (item) => {
            return [
                item.pla_office?.toString().trim(),
                item.pla_fk_pluid?.toString().trim(),
                item.pla_cellid?.toString().trim()
            ].join('|');
        };        

        const existingKeys = new Set(
            existingData.map(item => normalizeKey(item))
        );

        const dataToInsert = modifiedResults.filter(item => {
            const key = normalizeKey(item);
            const exists = existingKeys.has(key);
            logInfo(`Checking key: ${key}, exists in DB: ${exists}`);
            return !exists;
        });

        if (dataToInsert.length === 0) {
            logInfo('All data already exist. No new data inserted.');
            return res.status(200).json({ message: 'All data already exist. No new data inserted.', data: [] });
        }

        const response = await insertGroupPlanoModel(dataToInsert);
        logInfo('Data inserted successfully');
        res.status(200).json({ message: 'Data inserted successfully', data: response });
    } catch (error) {
        logError(`Error in checkGroupRakController: ${error.message}`);
        res.status(500).json({ message: 'Error reading type rak' });
    }
};

module.exports = { 
    checkItemController, 
    checkZonaRakController, 
    checkLineRakController, 
    checkGroupRakController 
};
