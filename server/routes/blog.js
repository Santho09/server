import express from 'express';
import { createBlog, deleteBlog, getAllBlogs, getBlogById, getBlogBySearch, updateBlog } from '../controller/blog.js';
import auth from '../middleware/index.js'; // Import authentication middleware

const router = express.Router();

// Routes
router.post('/', auth, createBlog); // Create blog (protected route)
router.get('/', getAllBlogs); // Get all blogs (public route)
router.get('/search', getBlogBySearch); // Search blogs (public route)
router.get('/:id', getBlogById); // Get a single blog by ID (public route)
router.post('/:id', auth, updateBlog); // Update blog by ID using POST (protected route)
router.delete('/:id', auth, deleteBlog); // Delete blog by ID (protected route)

export default router;
