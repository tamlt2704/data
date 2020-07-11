const express = require('express');
var tesseract = require('node-tesseract');
const logger = require("morgan");
const path = require("path");

var api = require("./routes/api.js");
var admin = require("./routes/admin.js");
const app = express()

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', api);
app.use('/admin', admin);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => {
    console.log( 'server is running' )
})
