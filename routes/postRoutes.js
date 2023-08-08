const Post = require('../models/postModel');
const express = require('express');
const router = express.Router();
const upload = require('../multer');
const cloudinary = require('../cloudnary');

router.post("", upload.single('image'), async (req, res, next) => {
    try {
        // Check if req.file is available
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Process other form data (title, content, etc.)
        const { title, content } = req.body;

        // Create a new post using the PostModel
        const newPost = new Post({
            title,
            content,
            image: result.secure_url // Store the Cloudinary URL
        });

        // Save the new post to the database
        await newPost.save();

        // Respond with success message
        res.status(201).json({
            message: "Post added successfully",
            post: newPost
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Other route handlers...

  

// READ OPERATION
router.get("/myposts", async (req, res, next) => {
    try {
      // Fetch blogs created by the user
    //   const userId = req.user.id; // Assuming you have user authentication in place
      const userBlogs = await Post.find();
  
      res.status(200).json({
        message: "User's blogs fetched successfully",
        blogs: userBlogs
      });
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
//UPDATE OPERATION
router.put("/:id", async (req, res) => {
    try {
      const blogId = req.params.id;
      const updatedData = {
        title: req.body.title,
        content: req.body.content
      };
  
      const updatedBlog = await Post.findByIdAndUpdate(blogId, updatedData, { new: true });
  
      if (updatedBlog) {
        res.status(200).json({ message: "Blog updated successfully", post: updatedBlog });
      } else {
        res.status(404).json({ message: "Blog not found" });
      }
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'An error occurred' });
      }
    });


//DELETE OPERATION
router.delete("/:id", async (req, res, next) => {
    try {
      const blogId = req.params.id;
      const deletedBlog = await Post.findByIdAndDelete(blogId);
  
      if (deletedBlog) {
        res.status(200).json({ message: "Blog deleted successfully" });
      } else {
        res.status(404).json({ message: "Blog not found" });
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });


module.exports = router;