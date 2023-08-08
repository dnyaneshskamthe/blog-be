const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dcelev1bt', 
  api_key: '562868133722793', 
  api_secret: 'ZiDAqhod_gtAcEcbaSmQJ2QRfGA' 
});

module.exports = cloudinary;