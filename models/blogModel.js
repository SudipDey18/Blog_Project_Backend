import db from '../config/db.js'
import idGenerator from '../config/idGenerator.js';

const {genId} = idGenerator;

const createBlogsTable = async ()=>{
    const createTableQuery = `CREATE TABLE IF NOT EXISTS Blogs(
        BlogId VARCHAR(60) NOT NULL PRIMARY KEY,
        Title VARCHAR(100),
        Content TEXT,
        Writer VARCHAR(50) DEFAULT 'UNKNOWN',
        Likes int DEFAULT 0
    )`;

    await db.query(createTableQuery);
}

const createBlog = async (Blog) =>{
    const createBlogQuery = `INSERT INTO Blogs
    (Title, Content, Writer, BlogId) VALUES ( ?, ?, ?, ?)`;
    let Id = '';

    try {
        Id = genId();
    } catch (error) {
        return ({Error: error}); 
    }

    try {
        await createBlogsTable();
    } catch (error) {
        return ({Error: error}); 
    }

    try {
        await db.query(createBlogQuery, [Blog.Title, Blog.Content, Blog.User, Id])
        return {Message: "Blog Created Successfully"};
    } catch (error) {
        console.log(error);
        
        return ({Error: error});
    }
}

const viewBlogs = async ()=>{
    const viewBlogsQuery = `SELECT * FROM Blogs`;

    try {
        await createBlogsTable();
    } catch (error) {
        return ({Error: error}) 
    }

    try {
        const blogs = await db.query(viewBlogsQuery);
        return {Blogs: blogs[0]};
    } catch (error) {
        return ({Error: error});
    }
}

const getBlogData = async (id) => {
    const getBlogQuery = `SELECT * FROM Blog_Project.Blogs WHERE BlogId = ${id};`
    try {
        await createBlogsTable();
    } catch (error) {
        return ({Error: error}) 
    }
    try {
        const blog = (await db.query(getBlogQuery))[0];
        return {Blog: blog[0]}
    } catch (error) {
        console.log(error);
        return {Error: error}
    }
}

export default {createBlog, viewBlogs, getBlogData}