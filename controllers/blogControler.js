import blogModel from "../models/blogModel.js";

const { createBlog, viewBlogs, getBlogData, like, withdrawLike , deleteBlog } = blogModel;

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
        
        return res.send({Blogs: data.Blogs});
    } catch (error) {
        return res.send({Error: "Somethig Went Wrong"});
    }
}

const getBlog = async (req,res) => {
    const id  = req.params.Id;
    try {
        const Data = await getBlogData(id);
        if (Data.Error) {
            return res.status(500).json({Error: "Internal Server Error"})
        }
        if (!Data.Blog.BlogId) return res.status(404).json({Error: "Requested Blog Not Found"});
        return res.status(200).json({Blog: Data.Blog || []})
    } catch (error) {
        return res.status(404).json({Error: "Requested Blog Not Found"});
    }
}

const likeBlog = async (req,res) => {
    const {BlogId, UserId} = req.body;
    let BlogLikes = [];
    if(typeof req.body.BlogLikes === "string"){
        BlogLikes = JSON.parse(req.body.BlogLikes);
    } else{
        BlogLikes = req.body.BlogLikes;
    }
    
    if (BlogLikes.includes(UserId)) {
        
        const index = BlogLikes.indexOf(UserId);   
        
        try {
            const data = await withdrawLike({BlogId, index});
            
            if(data.Message) {
                return res.status(200).json(data)
            }else{
                return res.status(500).json({Error: "Something Went wrong 1"});
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({Error: "Something Went wrong 2"});
        }
        
    }else {
        try {
            const data = await like({BlogId, UserId});
            if(data.Message) {
                return res.status(200).json(data);
            }else{
                return res.status(500).json({Error: "Something Went wrong 3"});
            }

        } catch (error) {
            return res.status(500).json({Error: "Something Went wrong 4"});
        }
    }

}

const blogDelete = async (req,res) => {
    
    const {BlogId, OwnerId} = req.body;
    try {
        let Data = await deleteBlog({BlogId, OwnerId});
        if(Data.ErrorMessage){
            res.status(401).json({Message: Data.ErrorMessage})
        }else{
            res.status(200).json(Data);
        }
    } catch (error) {
        res.status(500).json({Error: "Internal Server Error"});
    }
}

export default {creatingBlog,getBlogs,getBlog, likeBlog, blogDelete}




