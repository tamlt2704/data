const express = require("express");
var app = express.Router();

app.get('/time', (req, res) => {
        res.json({'time': new Date()});
    
});


module.exports = app;
