var fs = require('fs')
var spreadsheet = JSON.parse(fs.readFileSync('/dev/stdin').toString())
var diffs = []

spreadsheet.map(function(row) {
  // || fs.existsSync('/Users/kolsen/Documents/TDXImages/'+row.original)
  var file = '/Users/kolsen/Documents/TDXImages/'+row.renamed
  if(row.renamed && fs.existsSync(file)) {
    var diff = {file:row.renamed, desc: null, exifDesc: null, credit: null, exifCredit: null}
      , exif = JSON.parse(fs.readFileSync(file+'.json'))
      , _diff = false

    if(row.description != exif.Description) {
      diff.desc = row.description
      diff.exifDesc = exif.Description
      _diff = true
    }
    if(row.credit != exif.Credit) {
      diff.credit = row.credit
      diff.exifCredit = exif.Credit
      _diff = true
    }
    if(_diff) {
      diffs.push(diff)
    }
  }
})

console.log(JSON.stringify(diffs))
