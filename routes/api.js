const express = require("express");
var app = express.Router();
var fs = require('fs')
var gadm_countries_json = require('../public/data/gadm.json');
var fetch = require('node-fetch')

app.get('/time', (req, res) => {
        res.json({'time': new Date()});
});

app.get('/gadm/:countryCode?/:adminLvl?', async (req, res, next) => {
    try {
        let countryCode = req.params.countryCode;

        if (countryCode) {
            // const admin_lvl = req.query.admin_lvl || 0;
            const adminLvl = req.params.adminLvl || 0;
            const url = `https://raw.githubusercontent.com/tamlt2704/data/develop/gadm/topojson/gadm36_${countryCode}_${adminLvl}.json`;
            let json = null;
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    json = data;
                    console.log( data )
                })
                .catch(err => console.log(err))
                
            res.json({
                countryCode,
                adminLvl,
                json
            }) 
        }  else {
            res.json(gadm_countries_json)
        }
    } catch (e) {
        next(e)
    }
})


module.exports = app;
