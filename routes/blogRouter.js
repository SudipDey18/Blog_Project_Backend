import express from 'express'
import blogControler from '../controllers/blogControler.js';

const route = (express.Router());
const {creatingBlog,getBlogs} = blogControler;


route.post('/create',creatingBlog);
route.get('/view',getBlogs);

export default route