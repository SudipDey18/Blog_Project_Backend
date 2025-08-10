import db from '../config/db.js';
import { getUserId } from '../config/idGenerator.js';
import emailSend from '../config/emailSend.js';

const {welcomeMail} = emailSend;

const UsersTableCreate = async () => {
    const createTable = `CREATE TABLE IF NOT EXISTS Users (
        UserId VARCHAR(60) NOT NULL PRIMARY KEY,
        Name VARCHAR(20),
        Email VARCHAR(25),
        Password VARCHAR(150),
        Role VARCHAR(6)
    )`

    await db.query(createTable);
}

const createUser = async (user, pass) => {
    const userId = getUserId();
    const Create_query = `INSERT INTO Users
    (UserId, Name, Email, Password, Role)
    VALUES
    (?, ?, ?, ?, ?)`;

    try {
        await UsersTableCreate();
    } catch (error) {
        return { Error: error };
    }
    try {
        let response = await db.query(Create_query, [userId, user.Name, user.Email, pass, user.Role]);
        // console.log("res"+response);
        await welcomeMail({Email:user.Email,Name:user.Name});
        return { Message: "User created successfully" }
    } catch (error) {
        return { Error: error };
    }
};

const getAllUser = async () => {
    try {
        await UsersTableCreate();
    } catch (error) {
        return { Error: error };
    }
    try {
        const allUserQuery = `SELECT * FROM Users`
        const [users] = await db.query(allUserQuery);
        return users;
    } catch (error) {
        return error;
    }
};

const findUser = async (data) => {
    const findUserQuery = `SELECT * FROM Users WHERE Email = ?`;
    try {
        await UsersTableCreate();
    } catch (error) {
        return { Error: error };
    }

    const isExist = await isUserExists(data);

    if (isExist.Error) return {
        code: 404,
        Error: "Something went wrong. Please try again later"
    }
    if (isExist.Data > 0) {
        try {
            const userData = (await db.query(findUserQuery, [data]))[0];
            return {
                User: userData[0],
            }
        } catch (err) {
            return {
                code: 404,
                Error: "Something went wrong. Please try again later"
            }
        }
    } else {
        return {
            code: 403,
            Error: "Invalid Email or Password"
        }
    }
}

const isUserExists = async (email) => {
    try {
        await UsersTableCreate();
    } catch (error) {
        return { Error: error };
    }
    const isExistsQuery = `SELECT COUNT(*) AS count FROM Users WHERE Email = ?`;
    try {
        const [result] = await db.query(isExistsQuery, [email]);
        // console.log(result);

        return { Data: result[0].count };

    } catch (error) {
        return { Error: error };
    }
}

const updatePassword = async (email, pass) => {
    let passUpdateQuery = `UPDATE Users
        SET Password = ?
        WHERE Email = ?`;
    try {
        await db.query(passUpdateQuery, [pass,email]);
        return { Message: "Password update sucessfully" };
    } catch (error) {
        return { error }
    }
}

export default { createUser, getAllUser, findUser, isUserExists, updatePassword };
