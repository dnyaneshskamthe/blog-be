const mongoose = require('mongoose');
require('dotenv').config();


const MONGODB_URI = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

module.exports = mongoose;
