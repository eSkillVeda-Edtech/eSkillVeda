require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require('./routes/api');

const port = process.env.PORT;
const DBurl = process.env.mongoDB;
const app = express();

mongoose.connect(DBurl).then(()=> console.log('Database connected...'))

app.use(cors());
app.use(express.json({extended: false}));
app.use(express.urlencoded({extended: false}));
app.use('/', router)

app.listen(port, ()=> console.log(`Server running on http://localhost:${port}`))