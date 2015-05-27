module.exports = function(meta) {
  cultureOrCountryContinent = meta.life_date ||
    meta.country && meta.country + (meta.continent ? ', ' + meta.continent : '') ||
    meta.continent && meta.continent

  var tomb = [
    meta.artist && meta.artist + ", " + cultureOrCountryContinent,
    meta.title +', '+ meta.dated,
    meta.medium,
    meta.creditline + ', ' + meta.accession_number,
    meta.image_copyright && decodeURIComponent(meta.image_copyright)
  ]

  return tomb.join("\n").trim()
}
