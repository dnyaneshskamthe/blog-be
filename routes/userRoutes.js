const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); 
const Post = require('../models/postModel')
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth')

// Define sign-up route
router.post('/signUp', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(200).json({ message: 'Sign up successful' });
  } catch (error) {
    res.status(500).json({ message: 'Sign up failed' });
  }
});

// Define sign-in route
router.post('/signIn', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        // Create a payload for the JWT containing user data
        const payload = {
            id: user._id,
            email: user.email,
            name: user.username,
        };
       // Sign the JWT with the payload and a secret key
       const secretKey = process.env.JWT_SECRET_KEY; // Replace this with your own secret key
       const token = jwt.sign(payload, secretKey); // Set expiration time if needed
       const userId = user._id;
      res.status(200).json({ message: 'Sign in successful',token,userId });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sign in failed' });
  }
});

// Get user profile
// Get user profile with profile picture
router.get('/profile', checkAuth, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have a middleware that extracts user ID from authentication
    const user = await User.findById(userId);

    if (user) {
      const userProfile = {
        name: user.username,
        email: user.email,
        // Initialize the profilePicture as null
        profilePicture: null,
        // Add more user profile data if needed
      };

      // Find a post authored by the user
      const userPost = await Post.findOne({ author: userId });

      // If a user post is found, extract the profile picture URL
      if (userPost) {
        userProfile.profilePicture = userPost.image;
      }

      res.status(200).json({ user: userProfile });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


module.exports = router;
