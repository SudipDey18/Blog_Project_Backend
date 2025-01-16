import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: 'SudipRoot',
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERTIFICATE
    }
});

export default pool;
