module.exports = function(meta) {
	var tomb = [
		meta.artist && meta.artist + ", " + meta.life_date,
		meta.title,
		meta.dated,
		meta.medium,
		meta.creditline + ' ' + meta.accession_number
	]

	return tomb.join("\n")
}
