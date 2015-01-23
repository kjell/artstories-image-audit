var fs = require('fs')
var spreadsheet = JSON.parse(fs.readFileSync('/dev/stdin').toString())
var diffs = []

spreadsheet.map(function(row) {

  var dir = '/Users/kolsen/Documents/TDXImages/'
    , files = ([row.original, row.renamed])

  files.map(function(file) {
    if(!file) return
    var filePath = dir+file
    if(fs.existsSync(filePath)) {
      var diff = {file:file, desc: null, exifDesc: null, credit: null, exifCredit: null}
        , exif = JSON.parse(fs.readFileSync(filePath+'.json'))
        , _diff = false

      if(row.description != exif.Description) {
        diff.desc = row.description
        if(exif.Description) diff.exifDesc = exif.Description
        _diff = true
      }
      if(row.credit != exif.Credit) {
        diff.credit = row.credit
        if(exif.Credit) diff.exifCredit = exif.Credit
        _diff = true
      }
      if(_diff) {
        diffs.push(diff)
      }
    }
  })
})

console.log(JSON.stringify(diffs))
