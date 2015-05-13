var fs = require('fs')
var spreadsheet = JSON.parse(fs.readFileSync('/dev/stdin').toString())
var existingCredits = JSON.parse(fs.readFileSync('artstories-credits.json').toString())
var newCredits = existingCredits
var findInternalCaption = require('./caption-mia-image')
var tombstone = require('./tombstone')

delete existingCredits['']

captioned = {}

spreadsheet.forEach(function(row) {
	var orig = row.original.replace(/\.(tif|jpg)/, '').trim()
	var renamed = row.renamed && row.renamed.replace(/\.(tif|jpg)/, '').trim() || orig
	var existingCredit = existingCredits[orig] || existingCredits[renamed]
	var newCredit = existingCredit || {}
  if(captioned[renamed || orig]) return

	if(orig == renamed && orig.match(/mia_|PCD|clark_/i)) {
		findInternalCaption.q.push(orig, function(result, f) {
			if(result == 'error') return console.error('error on ', orig)

      var credit = newCredits[orig.replace(/\.(tif|jpg)/, '')]
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

  if(orig.match(/2013_TDXAfrica/)) {
    newCredit.description = newCredit.description || newCredit.oldDescription
    newCredit.credit = newCredit.credit || newCredit.oldCredit
  }

	newCredits[(renamed || orig).replace(/\.(tif|jpg)/, '')] = newCredit
  captioned[renamed || orig] = true
})

findInternalCaption.q.drain = function() {
	console.log(JSON.stringify(newCredits))
	findInternalCaption.done()
}
