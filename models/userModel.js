import db from '../config/db.js';

const UsersTableCreate = async ()=>{
    const createTable = `CREATE TABLE IF NOT EXISTS Users (
        UserId int NOT NULL AUTO_INCREMENT,
        Name VARCHAR(20),
        Email VARCHAR(25),
        Password VARCHAR(150),
        Role VARCHAR(6),
        Gender VARCHAR(6)
    )`

    await db.query(createTable);
}

const createUser = async (user,pass) => {
    const Create_query = `INSERT INTO Users
    (Name, Email, Password, Role, Gender)
    VALUES
    (?, ?, ?, ?, ?)`;
    try {
        await UsersTableCreate();
    } catch (error) {
        return {Error: error};
    }
        try{
            await db.query(Create_query, [user.Name, user.Email, pass, user.Role, user.Gender])
            // const allUsers = await getAllUser();
            return {Message: "User created successfully"}
        }catch(error){ 
            return {Error: error};
        }
};

const getAllUser = async() => {
    try {
        const allUserQuery = `SELECT * FROM Users`
        const [users] = await db.query(allUserQuery);
        return users; 
    } catch (error) {
        return error;
    }
};

const findUser = async (data)=>{
    const findUserQuery = `SELECT * FROM Users WHERE Email = ?`;
    const isExist = await isUserExists(data);
    
    if (isExist.Error) return {
        code: 404,
        Error: "Something went wrong. Please try again later"
    }
    if (isExist.Data > 0) {
        try {
            const userData = (await db.query(findUserQuery,[data]))[0];
            // console.log(userData[0].Name);
            return {
                User: userData[0],
            }
        } catch (err) {
            return {
                code: 404,
                Error: "Something went wrong. Please try again later"
            }
        }
    }else{
        return {
            code: 403,
            Error: "Invalid Email or Password"
        }
    }
}

const isUserExists = async(user)=>{
 const isExistsQuery = `SELECT COUNT(*) AS count FROM Users WHERE Email = ?`;
 try {
    const [reasult] = await db.query(isExistsQuery,[user]);
    return {Data: reasult[0].count};
    
 } catch (error) {
    return {Error: error};
 }
}


export default { createUser, getAllUser, findUser, isUserExists};