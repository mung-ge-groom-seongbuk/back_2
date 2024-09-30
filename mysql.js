require('dotenv').config({path:'./.env'}); // 환경 변수 불러오기
const mysql = require('mysql2/promise');

let test = async () => {
    // 환경 변수 접근
    const db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        waitForConnections: true,
        insecureAuth: true
    });
    let sql = 'SELECT * FROM reservation';
    let [rows, fields] = await db.query(sql);
    console.log(rows);
};
test();