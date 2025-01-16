import express from "express";
import userController from "../controllers/userControler.js";
import cookieParser from "cookie-parser";


const route = (express.Router());
const { isLogin, SignUp, Login, setCookie } = userController;

route.use(cookieParser());
route.post('/signup',SignUp);
route.post('/login',Login);
route.get('/verify/:jwtToken',isLogin);
route.get('/a',setCookie);

export default route;