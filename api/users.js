const express = require('express'); 
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");

    next(); 
});

const { getAllUsers } = require('../db');

// This middlewre will fire whenever a GET request is made to /api/users and send back a simple object with and empty array
usersRouter.get('/', async (req, res) => { 
    const users = await getAllUsers();

    res.send({
        users
    });
});

module.exports = usersRouter;