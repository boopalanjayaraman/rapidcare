const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

//// these two are necessary for production envs.
const compression = require('compression');
const helmet = require('helmet');

//// routes
const users = require("./routes/api/users");
const products = require("./routes/api/products");
const insurances = require("./routes/api/insurances");
const claims = require("./routes/api/claims");

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

//// db config check
const db = require("./config/configuration").dbOptions.mongoURI;
const pwd = require("./config/configuration").dbOptions.mongoPwd;
  
//// connect to mongo db and check
mongoose
.connect(db, {pass : pwd, useNewUrlParser: true, useUnifiedTopology:true})
.then(() => console.log("mongo db is connected successfully.."))
.catch(err => console.log(err));

//// use passport 
app.use(passport.initialize());

//// passport configurations
require("./config/passport")(passport);

//// map routes
app.use("/api/users", users);
//app.use("/api/products", products);
//app.use("/api/insurances", insurances);
//app.use("/api/claims", claims);

/// render client build directory content
/*app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});*/


const port = process.env.PORT || 5000;

const LogService = require("./services/logService");
const Container = require("typedi").Container;

const logService = Container.get(LogService);

//// listen
app.listen(port, () => { 
    console.log(`Server is up and running on port ${port} ..`);
    logService.info('Server is started. Up and running.', { port: port});
});

