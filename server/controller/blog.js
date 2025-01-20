import Blog from "../models/blog.js";
import user from "../models/user.js";

export const createBlog = async (req, res) => {
    const { title, description, author, selectedFile, tags } = req.body;
    try {
        const existing_user = await user.findById(author);
        if (!existing_user) {
            return res.status(404).json({ mssg: "User doesn't exist" });
        }
        const newBlog = new Blog({
            title,
            description,
            author,
            selectedFile,
            tags
        });
        await newBlog.save();
        return res.status(201).json({ mssg: "Blog created successfully", blog: newBlog });
    } catch (error) {
        return res.status(500).json({ mssg: "Something went wrong" });
    }
};

export const getAllBlogs=async(req,res)=>{
    try{
        const blogs=await Blog.find({})
        return res.status(200).json({blogs})
    }
    catch(error){
        return res.status(500).json({mssg:"Something went wrong"})
    }
}
export const getBlogById=async(req,res)=>{
    const {id}=req.params
    try{
        const blog=await Blog.findById(id)
        if(!blog){
            return res.status(404).json({mssg:'Blog not found'})
        }
        return res.status(200).json({blog})
    }
    catch(error){
        console.error(error); 
        return res.status(500).json({mssg:"Something went wrong",error:error.message})
    }
}
export const getBlogBySearch=async(req,res)=>{
    const {searchQuery,tags}=req.query
    console.log(searchQuery,tags)
    try{
      const title=new RegExp(searchQuery,'i')

      let blogs;
      if(tags){
        blogs=await Blog.find({$or:[{title},{tags:{$in:tags.split(',')}}]})
      }
      else{
        blogs=await Blog.find({title})
      }
      return res.status(200).json({blogs})
    }
    catch(error){
        return res.status(404).json({mssg:"Something went wrong"})
    }
}
export const updateBlog=async(req,res)=>{
    const {id}=req.params
    const {title,description,selectedFile,tags}=req.body
    try{
        const updatedBlog=await Blog.findByIdAndUpdate(id,{title,description,selectedFile,tags},{new:true})
        return res.status(200).json({updatedBlog})
    }
    catch(error){
        return res.status(500).json({mssg:'Something went wrong'})
    }
}
export const deleteBlog=async(req,res)=>{
    const {id}=req.params
    try{
        await Blog.findByIdAndDelete(id)
        return res.status(200).json({mssg:"Blog deleted successfully"})
    }
    catch(error){
        return res.status(500).json({mssg:'Something went wrong'})
    }
}