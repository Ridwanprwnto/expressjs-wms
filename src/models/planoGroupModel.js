const pool = require('../config/db');
const { logInfo, logError } = require('../utils/logger');

const checkItemTablokModel = async (office, pluid, flag) => {
    const query = 'SELECT A.pla_cellid, A.pla_fk_plukode, B.mbr_full_nama, A.pla_fk_tipe, A.pla_zona, A.pla_station, A.pla_line, A.pla_rak, A.pla_shelf, A.pla_cell, A.pla_zonabarang FROM dc_planogram_t A INNER JOIN dc_barang_dc_all B ON A.pla_fk_pluid = B.mbr_fk_pluid WHERE A.pla_dc_kode = $1 AND A.pla_fk_pluid = $2 AND A.pla_display = $3';
    const values = [office, pluid, flag];
    try {
        const result = await pool.query(query, values);
        logInfo(`checkItemTablokModel executed successfully for office: ${office}, pluid: ${pluid}`);
        return result.rows[0];
    } catch (error) {
        logError(`Error in checkItemTablokModel: ${error.message}`); 
        throw error;
    }
};

const checkZonaRakModel = async (tiperak, flag) => {
    const query = 'SELECT pla_zonarak FROM dc_planogram_zonarak_t WHERE pla_fk_tipe = $1 AND pla_tipe_display IS NULL OR pla_fk_tipe = $1 AND pla_tipe_display != $2 ORDER BY pla_zonarak ASC';
    const values = [tiperak, flag];
    try {
        const result = await pool.query(query, values);
        logInfo(`checkZonaRakModel executed successfully for tiperak: ${tiperak}`);
        return result.rows;
    } catch (error) {
        logError(`Error in checkZonaRakModel: ${error.message}`);
        throw error;
    }
};

const checkLineRakModel = async (tiperak, linerak, flag) => {
    const query = 'SELECT pla_rak FROM dc_planogram_t WHERE pla_fk_tipe = $1 AND pla_line = $2 AND pla_storage = $3 GROUP BY pla_rak;';
    const values = [tiperak, linerak, flag];
    try {
        const result = await pool.query(query, values);
        logInfo(`checkLineRakModel executed successfully for tiperak: ${tiperak}, linerak: ${linerak}`);
        return result.rows;
    } catch (error) {
        logError(`Error in checkLineRakModel: ${error.message}`);
        throw error;
    }
};

const checkGroupRakModel = async (OFFICEID, TYPEPLA, LINEPLA, RAK_PLA, FLAG) => {
    const query = `
        SELECT pla_gd_kode, pla_lok_kode, pla_fk_lokasiid, pla_cellid, pla_line, pla_rak, pla_shelf, pla_cell 
        FROM dc_planogram_t 
        WHERE pla_dc_kode = $1 
        AND pla_fk_tipe = $2 
        AND pla_line = $3 
        AND pla_storage = $4 
        AND pla_rak = ANY($5::text[])
    `;
    const values = [OFFICEID, TYPEPLA, LINEPLA, FLAG, RAK_PLA];
    try {
        const result = await pool.query(query, values);
        logInfo(`checkGroupRakModel executed successfully for OFFICEID: ${OFFICEID}, TYPEPLA: ${TYPEPLA}`)
        return result.rows;
    } catch (error) {
        logError(`Error in checkGroupRakModel: ${error.message}`);
        throw error;
    }
};

const checkExistingRakModel = async (data) => {
    const query = `
        WITH input_data(pla_office, pla_fk_pluid, pla_cellid) AS (
            SELECT * FROM unnest($1::text[], $2::numeric[], $3::numeric[])
        )
        SELECT d.pla_dc_kode AS pla_office, d.pla_fk_pluid, d.pla_fk_cellid AS pla_cellid
        FROM dc_planogram_group_t d
        INNER JOIN input_data i
        ON i.pla_office = d.pla_dc_kode
        AND i.pla_fk_pluid = d.pla_fk_pluid
        AND i.pla_cellid = d.pla_fk_cellid;
    `;

    const pla_offices = data.map(item => item.pla_office);
    const pla_fk_pluids = data.map(item => Number(item.pla_fk_pluid));
    const pla_cellids = data.map(item => Number(item.pla_cellid));

    try {
        const result = await pool.query(query, [pla_offices, pla_fk_pluids, pla_cellids]);
        logInfo('checkExistingRakModel executed successfully');
        return result.rows;
    } catch (error) {
        logError(`Error in checkExistingRakModel: ${error.message}`);
        throw error;
    }
};

const insertGroupPlanoModel = async (data) => {
    const query = `
        INSERT INTO dc_planogram_group_t (pla_fk_cellid, pla_fk_pluid, pla_fk_plukode, pla_dc_kode, pla_gd_kode, pla_lok_kode, pla_fk_lokasiid, pla_updrec_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    const promises = data.map(async (item) => {
        const values = [
            item.pla_cellid,
            item.pla_fk_pluid,
            item.pla_fk_pluid,
            item.pla_office,
            item.pla_gd_kode,
            item.pla_lok_kode,
            item.pla_fk_lokasiid,
            item.pla_ip
        ];
        
        try {
            const result = await pool.query(query, values);
            logInfo(`insertGroupPlanoModel executed successfully for cellid: ${item.pla_cellid}`);
            return result.rows[0];
        } catch (error) {
            logError(`Error in insertGroupPlanoModel: ${error.message}`);
            throw error;
        }
    });
    return Promise.all(promises);
};

module.exports = {
    checkItemTablokModel,
    checkZonaRakModel,
    checkLineRakModel,
    checkGroupRakModel,
    checkExistingRakModel,
    insertGroupPlanoModel
};
