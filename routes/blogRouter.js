import express from 'express'
import blogControler from '../controllers/blogControler.js';

const route = (express.Router());
const {creatingBlog,getBlogs,getBlog} = blogControler;


route.post('/create',creatingBlog);
route.get('/view',getBlogs);
route.get('/blog/:Id',getBlog);

export default route