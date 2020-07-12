const express = require('express');
const logger = require("morgan");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

var api = require("./routes/api.js");
var admin = require("./routes/admin.js");
const app = express()

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, 'client/build')));

//swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            'title': 'jsdata api',
            'description': 'open access to data',
            'contact': {
                'name': 'github.com/tamlt2704'
            },
            'servers': ['http://localhost:5000', 'https://jsdata.heroku.com']
        }
    },
    apis: ['./routes/api.js']
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
api.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
//swagger

app.use('/api', api);
app.use('/admin', admin);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => {
    console.log( 'server is running' )
})
