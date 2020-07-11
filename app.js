const express = require('express');
var tesseract = require('node-tesseract');
const app = express()

app.use(express.static('public'))

app.get('/', (res, req) => {
    res.send('Hello World')
})

app.listen(process.env.PORT || 3000, () => {
    console.log( 'server is running' )
})
