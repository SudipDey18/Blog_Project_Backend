import mysql from 'mysql2/promise'

console.log(Date.now());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_db'
});

const createTableQuery = `CREATE TABLE IF NOT EXISTS Verification (
    Id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(50) NOT NULL,
    Otp CHAR(4),
    Requests SMALLINT(1),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`

const insertQuery = `INSERT INTO Verification
                    (Email, Otp, Requests)
                    VALUES
                    (? , ?, ?)`

async function db() {
    let email = "abc@ab.com";
    // await pool.query(createTableQuery);
    // await pool.query(insertQuery,["dey758489@gmail.com","4521",1]);
    // let data = await pool.query(`SELECT *
    //                 FROM Verification
    //                 WHERE Time < (NOW() - INTERVAL 22 HOUR) AND Email="dey758489@gmail.com";`)
    // let [data] = await pool.query(`SELECT * FROM Verification WHERE Id=1`)
    // console.log(new Date("2025-08-08 11:06:00").getTime());
    let prev = new Date(new Date('2025-08-08 22:06:00').getTime()+24*60*60*1000)
    console.log(prev-new Date());
    
    // return 1;
}

db();
