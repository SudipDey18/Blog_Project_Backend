import blogModel from "../models/blogModel.js";

const {createBlog, viewBlogs} = blogModel;

const creatingBlog = async (req,res) => {
    try {
        const data = await createBlog(req.body);
        if(data.Error) return res.status(400).json({Error: "Somethig Went Wrong"}); 
        return res.status(200).json({Message: data.Message});
    } catch (error) {
        return res.status(400).json({Error: "Somethig Went Wrong"});
    }
}

const getBlogs = async (req,res) => {
    try {
        const data = await viewBlogs();
        if(data.Error) return res.send({Error: "Somethig Went Wrong"});
        // console.log(data.Blogs);
        
        res.send({Blogs: data.Blogs});
    } catch (error) {
        res.send({Error: "Somethig Went Wrong"});
    }
}


export default {creatingBlog,getBlogs}