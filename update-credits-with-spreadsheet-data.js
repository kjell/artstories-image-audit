var fs = require('fs')
var spreadsheet = JSON.parse(fs.readFileSync('/dev/stdin').toString())
var existingCredits = JSON.parse(fs.readFileSync('artstories-credits.json').toString())
var newCredits = existingCredits
var findInternalCaption = require('./caption-mia-image')
var tombstone = require('./tombstone')

delete existingCredits['']

spreadsheet.forEach(function(row) {
	var orig = row.original.replace('.tif', '')
	var renamed = row.renamed.replace('.tif', '')
	var existingCredit = existingCredits[orig] || existingCredits[renamed]
	var newCredit = existingCredit || {}

	if(orig == renamed && orig.match(/mia|PCD/i)) {
		findInternalCaption.q.push(orig, function(result, f) {
			if(result == 'error') return // console.error('error on ', orig)

			var credit = newCredits[orig.replace('.tif', '')]
			newCredit.description = tombstone(result)
		})
	} else {
		if(existingCredit) {
			newCredit.oldDescription = existingCredit.description
			newCredit.oldCredit = existingCredit.credit
			newCredit.description = row.description
			newCredit.credit = row.credit
		}
	}

	newCredits[row.renamed.replace('.tif', '')] = newCredit
})

findInternalCaption.q.drain = function() {
	console.log(JSON.stringify(newCredits))
	findInternalCaption.done()
}
