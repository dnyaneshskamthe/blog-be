const path = require("path");
const express = require("express")
const mongoose = require("mongoose")
const db = require("./db/db")
const bodyParser = require('body-parser')
const cors = require('cors')
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes")
const app = express();
const PORT = process.env.PORT || 5000
require('dotenv').config();

// Serve static files from the public folder
app.use(express.static('public'));

// Handle the root route and serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cors());


app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.listen(PORT, (req, res) => {
console.log(`app is listening to PORT ${PORT}`)
})