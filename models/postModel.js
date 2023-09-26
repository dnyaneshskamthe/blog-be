const mongoose = require('mongoose');
const User = require('./userModel')

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : User,
        require : true
      }
}, {
    timestamps: true
});

const PostModel = mongoose.model('PostModel', postSchema);

module.exports = PostModel;
