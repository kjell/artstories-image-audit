var fs = require('fs')
var spreadsheet = JSON.parse(fs.readFileSync('/dev/stdin').toString())
var existingCredits = JSON.parse(fs.readFileSync('artstories-credits.json').toString())
var newCredits = existingCredits

delete existingCredits['']

spreadsheet.forEach(function(row) {
	var existingCredit = existingCredits[row.original.replace('.tif', '')] || existingCredits[row.renamed.replace('.tif', '')]
	if(!existingCredit) return
	var newCredit = existingCredit
  newCredit.oldDescription = existingCredit.description
  newCredit.oldCredit = existingCredit.credit
	newCredit.description = row.description
	newCredit.credit = row.credit

	newCredits[row.renamed.replace('.tif', '')] = newCredit
})

console.log(JSON.stringify(newCredits))
