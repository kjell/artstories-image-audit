sheet = TDX\ MIA\ ArtStories\ –\ Image\ Permissions\ Tracking.xlsx
csvs:
	j -N 0 $(sheet) > aaa.csv
	j -N 1 $(sheet) > asian-art.csv
	j -N 2 $(sheet) > contemporary.csv
	j -N 3 $(sheet) > dats.csv
	j -N 4 $(sheet) > jka.csv
	j -N 5 $(sheet) > paintings.csv
	j -N 6 $(sheet) > p+d.csv
	j -N 7 $(sheet) > photo.csv
	j -N 8 $(sheet) > videos.csv
