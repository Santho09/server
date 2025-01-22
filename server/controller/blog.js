import Blog from "../models/blog.js";
import User from "../models/user.js";

// Create a new blog
export const createBlog = async (req, res) => {
    const { title, description, author, selectedFile, tags } = req.body;
    try {
        const existingUser = await User.findById(author);
        if (!existingUser) {
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
        return res.status(500).json({ mssg: "Something went wrong", error: error.message });
    }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(500).json({ mssg: "Something went wrong", error: error.message });
    }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ mssg: "Blog not found" });
        }
        return res.status(200).json({ blog });
    } catch (error) {
        return res.status(500).json({ mssg: "Something went wrong", error: error.message });
    }
};

// Search blogs by title or tags
export const getBlogBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i'); // 'i' for case-insensitive search

        let blogs;
        if (tags) {
            blogs = await Blog.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
        } else {
            blogs = await Blog.find({ title });
        }
        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(404).json({ mssg: "Something went wrong", error: error.message });
    }
};

// Update a blog (using POST for update)
export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, description, selectedFile, tags } = req.body;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ mssg: "Blog not found" });
        }

        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== req.userId) {
            return res.status(403).json({ mssg: "Unauthorized to update this blog" });
        }

        // Update the blog with the new values
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, description, selectedFile, tags },
            { new: true } // Return the updated document
        );

        return res.status(200).json({ mssg: "Blog updated successfully", updatedBlog });
    } catch (error) {
        return res.status(500).json({ mssg: "Something went wrong", error: error.message });
    }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ mssg: "Blog not found" });
        }

        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== req.userId) {
            return res.status(403).json({ mssg: "Unauthorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(id);
        return res.status(200).json({ mssg: "Blog deleted successfully" });
    } catch (error) {
        return res.status(500).json({ mssg: "Something went wrong", error: error.message });
    }
};
