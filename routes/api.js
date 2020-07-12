const express = require("express");
var app = express.Router();
var fs = require('fs')
var gadm_countries_json = require('../public/data/gadm.json');
var fetch = require('node-fetch')
var multer  = require('multer');

const tesseract = require("node-tesseract-ocr")
const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
}


/**
 * @swagger
 *
 *  /api/time:
 *      get:
 *          description: get current time in server
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: current time
 *              
 * */

var upload = multer({
    'dest': './.tmp',
    'inMemory': false
});

/**
 * @swagger
 *      /api/ocr:
 *          post:
 *              summary: image to text
 *              consumes:
 *                  - multipart/form-data
 *              produces:
 *                  - application/json
 *              responses:
 *                  200:
 *                      description: get list of countries topo json
 *              parameters:
 *                  - in: formData
 *                    name: ocrimage 
 *                    type: file
 *                    description: Image contain text
 *
*/
app.post('/ocr', upload.single('ocrimage'), (req, res, next) => {
    try {
        var path = req.file.path;
        tesseract.recognize(path, config)
        .then(text => {
            fs.unlink(path, function (err) {
                if (err){
                    console.log( 'error unlink', err )
                    res.json(500, "Error while scanning image");
                }
                console.log('successfully deleted %s', path);
            });
            res.json(200, text);
        })
        .catch(error => {
            res.json(500, "Error while scanning image", error);
            console.log(error.message)
        })
    } catch (err) {
		console.log(err)
		res.json(500, "Error while scanning image");
    }
})

app.get('/time', (req, res) => {
        res.json({'time': new Date()});
});

/**
 * @swagger
 *
 *  /api/gadm/{countryCode}/{adminLvl}:
 *      get:
 *          description: return list of countries
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: get list of countries topo json
 *      parameters:
 *          - name: countryCode
 *            in: path
 *            description: country code, example VNM
 *            type: string
 *            required: false
 *          - name: adminLvl
 *            in: path
 *            description: get admin level (1,2,3)
 *            type: string
 *            required: false
 *            minimum: 1
 *            maximum: 3
 *              
 * */
app.get('/gadm/:countryCode?/:adminLvl?', async (req, res, next) => {
    try {
        let countryCode = req.params.countryCode;

        if (countryCode && (countryCode !== "undefined")) {
            // const admin_lvl = req.query.admin_lvl || 0;
            const adminLvl = req.params.adminLvl || 0;
            const url = `https://raw.githubusercontent.com/tamlt2704/data/develop/gadm/topojson/gadm36_${countryCode}_${adminLvl}.json`;
            let json = null;
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    json = data;
                })
                .catch(err => console.log(err))
                
            res.json({
                countryCode,
                adminLvl,
                json
            }) 
        } else {
            res.json(gadm_countries_json)
        }
    } catch (e) {
        next(e)
    }
})


module.exports = app;
