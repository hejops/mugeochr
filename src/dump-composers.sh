#!/usr/bin/env bash
set -euo pipefail

# generate a sqlite dump of composers on wikidata with birthplace, dob, dod
# (optional), and a list of works. birthplaces raw wikidata urls and are not
# resolved (yet)

urlenc() {
	node --eval "console.log(encodeURIComponent(process.argv[1]))" "$1"
}

query=$(
	cat <<- EOF
		# SELECT * only returns ?item
		# unknown columns (?) are silently ignored

		# human and humanLabel are hardcoded
		SELECT DISTINCT ?birthplace ?dob ?dod ?humanLabel
		WHERE {
		# https://github.com/zenon/SparqlExample/blob/89f68c8dad/README.md?plain=1#L40
			?human wdt:P19  ?birthplace .
			?human wdt:P569 ?dob .
			OPTIONAL {?human wdt:P570 ?dod .}
			?human wdt:P106 
				wd:Q36834;     # occupation = composer
				wdt:P1455 ?_ . # has list of works

			# ?human wdt:P101 wd:Q105107008 . # field = composition (not all have field)

			SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
		} 
		ORDER BY ?dob
	EOF
)

# 0.2 s
j=$(curl -Ss -H 'Accept: application/sparql-results+json' "https://query.wikidata.org/sparql?query=$(urlenc "$query")" |
	jq -cr '.results.bindings[] | {
		name: .humanLabel.value,
		birthplace: .birthplace.value,
		dob: .dob.value,
		dod: .dod.value,
	}')

csv=tmp.csv
db=composers.db

# json -> csv -> sqlite
# https://stackoverflow.com/a/46407771
{
	<<< "$j" head -n1 | jq -r 'keys_unsorted | @csv'
	<<< "$j" jq -r 'map(tostring) | @csv'
} > "$csv"

rm -rf "$db"

# TODO: set PK name
cat << EOF | sqlite3 $db
.mode csv
.import $csv composers
EOF

rm "$csv"
