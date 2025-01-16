import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    try {
        const token = jwt.sign({
            Name: user.Name,
            Email: user.Email,
            Role: user.Role
        }, process.env.SECRET_KEY);
        return {Token: token}   
    } catch (error) {
        return {Error: error}
    }
}

const verifyToken = (token) => {
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return {
            Message: "User already login",
            User: user
        }
    } catch (error) {
        return {Error: "User need to login"}
    }
}

export default {generateToken, verifyToken}