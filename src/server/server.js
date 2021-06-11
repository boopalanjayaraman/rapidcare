const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

//// these two are necessary for production envs.
const compression = require('compression');
const helmet = require('helmet');

const app = express();

//// use body parser middleware
app.use(
    bodyParser.urlencoded({extended: false})
);
app.use(bodyParser.json());


//Compress all routes
app.use(compression()); 
app.use(helmet({
    contentSecurityPolicy: false,
  }));


  
const port = process.env.PORT || 5000;

//// listen
app.listen(port, () => { 
    console.log(`Server is up and running on port ${port} ..`);
});

