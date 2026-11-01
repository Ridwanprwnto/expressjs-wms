const pool = require('../config/db');
const { logInfo, logError } = require('../utils/logger');

const checkTTDRetokModel = async (nrb, tgl, store) => {
    const query = 'SELECT shop, no_ttd, tgl_ttd, no_nrb, tgl_nrb, tot_rec, tgl_terima, tot_item_retur, flag_absensi, no_delivery_van, no_sj, tgl_sj, nik_driver_1, nama_driver_1, jml_koli, jml_cont, barcode_nrb, cek_koli, cek_cont, user_checker, nik_checker FROM dc_rettok_ttd_t WHERE no_nrb = $1 AND tgl_nrb = $2 AND shop = $3';
    const values = [nrb, tgl, store];
    try {
        const result = await pool.query(query, values);
        logInfo(`checkItemTablokModel executed successfully for nrb: ${nrb}, tgl: ${tgl}, and store: ${store}`);
        return result.rows[0];
    } catch (error) {
        logError(`Error in checkTTDRetokModel: ${error.message}`); 
        throw error;
    }
};

module.exports = {
    checkTTDRetokModel
};
