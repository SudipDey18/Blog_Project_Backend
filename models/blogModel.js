import db from '../config/db.js'
import { getBlogId } from '../config/idGenerator.js';

// Querys
const createTableQuery = `CREATE TABLE IF NOT EXISTS Blogs(
        BlogId VARCHAR(60) NOT NULL PRIMARY KEY,
        Title VARCHAR(100),
        Content TEXT,
        OwnerId VARCHAR(60) NOT NULL,
        Likes JSON DEFAULT ('[]'),
        FOREIGN KEY (OwnerId) REFERENCES Users(UserId)
    )`;

const createBlogQuery = `INSERT INTO Blogs
    (Title, Content, OwnerId, BlogId) VALUES ( ?, ?, ?, ?)`;

const viewBlogsQuery = `SELECT Blogs.BlogId, Blogs.Title, Blogs.Content, Blogs.Likes, Users.UserId, Users.Name
    FROM Blogs, Users
    Where Blogs.OwnerId = Users.UserId`;


// Executions
const createBlogsTable = async () => {
    try {
        await db.query(createTableQuery);
    } catch (error) {
        throw error;
    }
}

const createBlog = async (Blog) => {
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
        await db.query(createBlogQuery, [Blog.Title, Blog.Content, Blog.OwnerId, Id])
        return { Message: "Blog Created Successfully" };
    } catch (error) {
        console.log(error);

        return ({ Error: error });
    }
}

const viewBlogs = async () => {

    try {
        await createBlogsTable();
    } catch (error) {
        console.log(error);

        return ({ Error: error })
    }

    try {
        const blogs = await db.query(viewBlogsQuery);
        return { Blogs: blogs[0] || [] };
    } catch (error) {
        console.log(error);

        return ({ Error: error });
    }
}

const getBlogData = async (id) => {
    const getBlogQuery = `SELECT Blogs.BlogId, Blogs.Title, Blogs.Content, Blogs.Likes, Users.UserId, Users.Name
    FROM Blogs, Users
    WHERE Blogs.OwnerId = Users.UserId AND BlogId = ${id}`
    try {
        await createBlogsTable();
    } catch (error) {
        return ({ Error: error })
    }
    try {
        const blog = (await db.query(getBlogQuery))[0];

        return { Blog: blog[0] || [] }
    } catch (error) {
        console.log(error);
        return { Error: error }
    }
}

const like = async (data) => {
    const likeQuery = `UPDATE Blogs
        SET Likes = JSON_ARRAY_APPEND(Likes, '$', '${data.UserId}')
        WHERE BlogId = '${data.BlogId}';`

    try {
        await db.query('START TRANSACTION');
        await db.query(likeQuery);
        const blogs = await db.query(viewBlogsQuery);
        await db.query('COMMIT');
        // console.log("Sucess Like");
        return { Message: "Liked Sucess", Blogs: blogs[0] || [] };
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
        const blogs = await db.query(viewBlogsQuery);
        await db.query('COMMIT');
        return { Message: "Like Withdraw Sucess", Blogs: blogs[0] || [] }
    } catch (error) {
        console.log(error);
        await db.query('ROLLBACK');
        return { Error: error.message }
    }
}

const deleteBlog = async (data) => {
    const deleteBlogQuery = `DELETE FROM Blogs WHERE BlogId = '${data.BlogId}'`
    const checkOwnerQuery = `SELECT OwnerId FROM Blogs WHERE BlogId = '${data.BlogId}' AND OwnerId = '${data.OwnerId}'`;

    try {
        let [blog] = (await db.query(checkOwnerQuery))[0];
        // console.log(blog.BlogId);
        if (blog.OwnerId == data.OwnerId) {
            await db.query(deleteBlogQuery);
            let Blogs = await db.query(viewBlogsQuery);
            return ({ Message: 'Blog Deleted Sucessfully', Blogs: Blogs[0] || [] });
        } else {
            return ({ ErrorMessage: 'Unauthorized Access' });
        }
    } catch (error) {
        console.log(error);

        return ({ Error: 'Something Went Wrong' });
    }
}

export default { createBlog, viewBlogs, getBlogData, like, withdrawLike, deleteBlog }