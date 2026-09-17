const db = require('./db');

const Domicilio = {
    findAll: async () => {
        const [rows] = await db.query("SELECT * FROM domicilio");
        return rows;
    },

    findById: async (uuid) => {
        const [rows] = await db.query("SELECT * FROM domicilio WHERE uuid = ?", [uuid]);
        return rows[0];
    },

    create: async (data) => {
        const {locationName, price} = data;
        const [result] = await db.query(`INSERT INTO domicilio (locationName, price) VALUES (?, ?)`,
            [locationName, price]
        );
        return result
    },

    update: async (uuid, data) => {
        const {locationName, price} = data;
        const updateData = {}
        if (locationName !== undefined) updateData.locationName = locationName;
        if (price !== undefined) updateData.price = price;

        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        if (fields.length === 0) {
        return {
            affectedRows: 0
        };
        }
        
        values.push(uuid);
        const sql = `UPDATE domicilio SET ${fields.join(', ')} WHERE uuid = ?`;
        const [result] = await db.query(sql, values);
        return result;
    },
    delete: async (uuid) => {
        const [result] = await db.query("DELETE FROM domicilio WHERE uuid = ?", [uuid]);
        return result
    }
};

module.exports = Domicilio