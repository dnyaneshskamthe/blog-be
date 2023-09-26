const express = require('express');
const router = express.Router();
const upload = require('../multer');
const cloudinary = require('../cloudnary');
const checkAuth = require('../middleware/checkAuth');
const Post = require('../models/postModel')

// Route for updating the user's profile picture
router.patch('/updateProfilePicture', checkAuth, upload.single('image'), async (req, res) => {
  try {
    // Check if req.file is available
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the new profile picture to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Update the user's profile picture URL in the database
    profilePicture = result.secure_url;
    const updatePic = new Post({
      image : profilePicture,
      author : req.user.id
    })
    await updatePic.save();
    // Respond with success message and the updated user data
    res.status(200).json({
      message: 'Profile picture updated successfully',
      user: req.user, // Send the updated user data
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
