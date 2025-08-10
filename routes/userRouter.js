import express from "express";
import userController from "../controllers/userControler.js";
import cookieParser from "cookie-parser";


const route = (express.Router());
const { isLogin, signUp, login, forgotPass} = userController;

route.use(cookieParser());
route.post('/signup',signUp);
route.post('/login',login);
route.get('/verify/:jwtToken',isLogin);
route.post('/forgotpass',forgotPass)

export default route;
