const tesseract = require("node-tesseract-ocr")

const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
}

tesseract.recognize("./.tmp/0ebec7e7d5227a65e6402f5d19324692", config)
.then(text => {
        console.log("Result:", text)
})
.catch(error => {
        console.log(error.message)
})
