import db from '../config/db.js'
import {getBlogId} from '../config/idGenerator.js';

// const { genBlogId } = idGenerator;

const createBlogsTable = async () => {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS Blogs(
        BlogId VARCHAR(60) NOT NULL PRIMARY KEY,
        Title VARCHAR(100),
        Content TEXT,
        Writer VARCHAR(50) DEFAULT 'UNKNOWN',
        Likes JSON DEFAULT ('[]')
    )`;

    await db.query(createTableQuery);
}

const createBlog = async (Blog) => {
    const createBlogQuery = `INSERT INTO Blogs
    (Title, Content, Writer, BlogId) VALUES ( ?, ?, ?, ?)`;
    let Id = '';

    try {
        Id = getBlogId();
    } catch (error) {
        return ({ Error: error });
    }

    try {
        await createBlogsTable();
    } catch (error) {
        console.log(error);
        return ({ Error: error });
    }


    try {
        await db.query(createBlogQuery, [Blog.Title, Blog.Content, Blog.User, Id])
        return { Message: "Blog Created Successfully" };
    } catch (error) {
        console.log(error);

        return ({ Error: error });
    }
}

const viewBlogs = async () => {
    const viewBlogsQuery = `SELECT * FROM Blogs`;

    try {
        await createBlogsTable();
    } catch (error) {
        console.log(error);

        return ({ Error: error })
    }

    try {
        const blogs = await db.query(viewBlogsQuery);
        return { Blogs: blogs[0] };
    } catch (error) {
        return ({ Error: error });
    }
}

const getBlogData = async (id) => {
    const getBlogQuery = `SELECT * FROM Blogs WHERE BlogId = ${id};`
    try {
        await createBlogsTable();
    } catch (error) {
        return ({ Error: error })
    }
    try {
        const blog = (await db.query(getBlogQuery))[0];
        return { Blog: blog[0] }
    } catch (error) {
        console.log(error);
        return { Error: error }
    }
}

const like = async (data) => {

    const likeQuery = `UPDATE Blogs
        SET Likes = JSON_ARRAY_APPEND(Likes, '$', ${data.UserId})
        WHERE BlogId = '${data.BlogId}';`

    try {
        await db.query('START TRANSACTION');
        await db.query(likeQuery);
        const blogs = await db.query(`SELECT * FROM Blogs`);
        await db.query('COMMIT');
        // console.log("Sucess Like");
        return { Message: "Liked Sucess", Blogs: blogs[0] };
    } catch (error) {
        console.log(error);
        await db.query('ROLLBACK');
        return ({ Error: error });
    }
}

const withdrawLike = async (data) => {
    const withdrawLikeQuery = `UPDATE Blogs
        SET Likes = JSON_REMOVE(Likes, '$[${data.index}]')
        WHERE BlogId = '${data.BlogId}';`

    try {
        await db.query('START TRANSACTION');
        await db.query(withdrawLikeQuery);
        const blogs = await db.query(`SELECT * FROM Blogs`);
        await db.query('COMMIT');
        return { Message: "Like Withdraw Sucess", Blogs: blogs[0] }
    } catch (error) {
        console.log(error);
        await db.query('ROLLBACK');
        return { Error: error.message }
    }
}

export default { createBlog, viewBlogs, getBlogData, like, withdrawLike }