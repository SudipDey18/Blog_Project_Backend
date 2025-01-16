import db from '../config/db.js'

const createBlogsTable = async ()=>{
    const createTableQuery = `CREATE TABLE IF NOT EXISTS Blogs(
        BlogId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        Title VARCHAR(100),
        Content TEXT,
        User VARCHAR(50) DEFAULT 'UNKNOWN',
        \`Like\` int DEFAULT 0
    )`;

    await db.query(createTableQuery);
}

const createBlog = async (Blog) =>{
    const createBlogQuery = `INSERT INTO Blogs
    (Title, Content, User) VALUES ( ?, ?, ?)`;

    try {
        await createBlogsTable();
    } catch (error) {
        return ({Error: error}); 
    }

    try {
        await db.query(createBlogQuery, [Blog.Title, Blog.Content, Blog.User])
        return {Message: "Blog Created Successfully"};
    } catch (error) {
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

export default {createBlog, viewBlogs}