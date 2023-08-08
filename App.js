const path = require("path");
const express = require("express")
const mongoose = require("mongoose")
const db = require("./db/db")
const bodyParser = require('body-parser')
const cors = require('cors')
const postRoutes = require("./routes/postRoutes");
const app = express();
const PORT = process.env.PORT || 5000
require('dotenv').config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cors());

app.use("/api/posts", postRoutes)

app.listen(PORT, (req, res) => {
console.log(`app is listening to PORT ${PORT}`)
})