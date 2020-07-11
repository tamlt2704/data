const express = require("express");
const path = require("path");

var app = express.Router();

app.use(express.static(path.join(__dirname, '../admin/build')));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../admin/build/index.html'));
    
});

module.exports = app;
