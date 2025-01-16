import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import pool from './config/db.js';
import userRouter from './routes/userRouter.js'
import blogRouter from './routes/blogRouter.js'


import dotenv from "dotenv"
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/user',userRouter);
app.use('/blogs',blogRouter);



pool.query("SELECT 1")
.then( ()=> {
    console.log('Database connected sucessfully');
    app.listen(process.env.Port, ()=>{
        console.log(`server is running at http://localhost:${process.env.Port}/`);
    }).on('error',(err)=>{
        console.error("Somethig went wrong",err);
    })
})
.catch((e)=>{
    console.log(e);
});