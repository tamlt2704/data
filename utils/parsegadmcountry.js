var fs = require('fs');
var readline = require('readline')
var countries = {}
async function parseGADMData() {
    var rl = readline.createInterface({
        input: fs.createReadStream('rawdata/gadmcountries.txt'),
        output: process.stdout,
        terminal: false
    })

    let code_pattern = /value=\"(.*)\"/;
    let country_fullname_pattern = />(.*)</;
    let countries = {}
    
    for await (const line of rl) {
        var arr = code_pattern.exec(line);
        if (arr) {
            let countryCode = arr[1].split('_')[0] || [""];
            let countryName = (country_fullname_pattern.exec(line) || ["", ""])[1]
            countries[countryCode] = countryName
        }
    }
    var json = JSON.stringify(countries)
    fs.writeFile('../public/data/gadm.json', json, 'utf8', (err) => {
        if (err) throw err;
        console.log( 'file saved' )
    })
}

parseGADMData()
