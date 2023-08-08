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
router.get("/mypost", (req, res, next) => {
Post.find({creator: req.userData.userId}).then(post => {
  if (post) {
    res.status(200).json({
        message: "Posts fetched successfully!",
        posts: post
    });
  }
}).catch(e=>{
    console.log(e)
});
});

//UPDATE OPERATION
router.put(
"/:id",
(req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
     
    });
    Post.updateOne(
        { _id: req.params.id},
        post
      ).then(result => {
        if(result){
            res.status(200).json({ message: "Update successful!" });
        }       
        else {
            res.status(500).json({ message: "Error Upating Post" });
        }
    });
}
);


//DELETE OPERATION
router.delete("/:id", (req, res, next) => {
Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
  result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    } else {
        return res.status(401).json({ message: "Not authorized!!" });
    }
  }
);
});

module.exports = router;