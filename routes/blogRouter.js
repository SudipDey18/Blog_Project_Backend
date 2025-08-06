import express from 'express'
import blogControler from '../controllers/blogControler.js';

const route = (express.Router());
const {creatingBlog,getBlogs,getBlog,likeBlog,blogDelete} = blogControler;


route.post('/create',creatingBlog);
route.get('/view',getBlogs);
route.get('/blog/:Id',getBlog);
route.put('/blog/like',likeBlog);
route.post('/blog/delete',blogDelete);

export default route