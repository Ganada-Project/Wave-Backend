const mysql = require('mysql');
const config = require('../../../../config');
const conn = mysql.createConnection(config);

exports.createBrandStyle = (brand_id, style_id, main) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO BrandStyle(brand_id, style_id, main) VALUES(?,?,?)',
            [brand_id, style_id, main],
            (err, result) => {
                if (err) reject(err);
                else resolve(result)
            });
    })
}