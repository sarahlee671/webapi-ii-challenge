const express = require('express');

const router = require('./router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({
        message: process.env.GREET,

    
    });
});

server.use('/api/posts', router);

module.exports=server;