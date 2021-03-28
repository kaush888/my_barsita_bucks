const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const cors = require("cors");
const { mongoDbUrl, PORT} = require("./config/configuration");



const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  next();
});

/* CONFIGURE EXPRESS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* CONFIGURE MONGOOSE TO CONNECT TO MONGODB */
mongoose
  .connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(response => {
    console.log("MongoDB connected successfully. ");
  })
  .catch(err => {
    console.log("Database connection failed. ");
  });

mongoose.set("debug", "true");
// mongoose.set("useCreateIndex", true);


app.use(express.static(path.join(__dirname, "./public")));



// /* ROUTES */

 const Routes = require("./routes/index");
 
 app.use("/", Routes);

/* Start The Server */
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Listening on port " + PORT + "\n");
});
