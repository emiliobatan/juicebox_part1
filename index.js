require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const { client } = require('./db');
client.connect();

const bodyParser = require('body-parser');
server.use(bodyParser.json()); // This function will read incoming JSON from requests 

const apiRouter = require('./api');
server.use('/api', apiRouter);

const morgan = require('morgan'); // This will allow us to log out each incoming request without us having to write a log in each route
server.use(morgan('dev')); 


server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });