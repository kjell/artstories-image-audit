sheet = TDX\ MIA\ ArtStories\ –\ Image\ Permissions\ Tracking.xlsx
csvs:
	[[ -f $(sheet) ]] || mv ~/Downloads/$(sheet) .
	j -N 0 $(sheet) > departments/aaa.csv
	j -N 1 $(sheet) > departments/asian-art.csv
	j -N 2 $(sheet) > departments/contemporary.csv
	j -N 3 $(sheet) > departments/dats.csv
	j -N 4 $(sheet) > departments/jka.csv
	j -N 5 $(sheet) > departments/paintings.csv
	j -N 6 $(sheet) > departments/p+d.csv
	j -N 7 $(sheet) > departments/photo.csv
	j -N 8 $(sheet) > departments/videos.csv

all.csv:
	csvstack -g aaa,asian,contemporary,dats,jka,p+d,paintings,photo,videos departments/*.csv \
		| sed '1 s/^.*$$/group,original,renamed,object,description,credit,source,contact,permissions,recieved?,passQC?,ready?,revision?,notes/' \
		> all.csv

check-description-and-credit:
	@csvgrep -c1 -i -r '^video' all.csv | csvcut -c2,3,5,6 | csvjson \
		| node check-description-and-credit.js \
		| jq '.' > differences.json
	json2csv -i differences.json -f file,desc,exifDesc,credit,exifCredit \
		> differences.csv

new-credits:
	@curl cdn.dx.artsmia.org/credits.json -o artstories-credits.json
	@csvgrep -c1 -i -r '^video' all.csv | csvcut -c2,3,5,6 | ag -v '^,+$$' \
	| csvjson | node update-credits-with-spreadsheet-data.js > new-credits.json
	scp new-credits.json dx:/apps/cdn/credits.json
