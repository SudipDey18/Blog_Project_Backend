import db from '../config/db.js';
import emailSend from "../config/emailSend.js";

const { sendOtpMail } = emailSend;

const createVerificationTable = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS Verification (
        Id SMALLINT AUTO_INCREMENT PRIMARY KEY,
        Email VARCHAR(50) NOT NULL,
        Otp CHAR(4),
        Requests SMALLINT(1) ,
        Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
    try {
        db.query(createTableQuery);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getVerificatrionDetails = async (email) => {
    const selectQuery = `SELECT * FROM Verification WHERE Email='${email}'`;
    try {
        await createVerificationTable();
        let [data] = await db.query(selectQuery);

        return { data: data[0] }
    } catch (error) {
        console.log(error);
        return { error };
    }
}

const insertVerificationCode = async (data) => {
    const insertQuery = `INSERT INTO Verification
        (Email, Otp, Requests)
        VALUES
        (? , ?, ?)`; 

    try {
        await db.query('START TRANSACTION');
        await db.query(insertQuery, [data.email, data.otp, 1]);
        let apiStatus = await sendOtpMail({ otp: data.otp, email: data.email, for: data.for });
        if (apiStatus == 201) {
            await db.query('COMMIT');
        } else {
            await db.query('ROLLBACK');
            throw error;
        }
        return { Message: "Insert Sucessfully" }
    } catch (error) {
        console.log(error);
        return { error }
    }
}

const updateVerification = async (data) => {
    const updeateVerificationQuery = `UPDATE Verification
        SET Requests=${data.requests}, Otp='${data.otp}'
        WHERE Email='${data.email}'`

    try {
        await db.query('START TRANSACTION');
        await db.query(updeateVerificationQuery);
        let apiStatus = await sendOtpMail({ otp: data.otp, email: data.email });
        if (apiStatus == 201) {
            await db.query('COMMIT');
        } else {
            await db.query('ROLLBACK');
            throw error;
        }
        return { Message: "Update Sucessfully" };
    } catch (error) {
        console.log(error);
        return { error };
    }
}

export default { getVerificatrionDetails, insertVerificationCode, updateVerification }