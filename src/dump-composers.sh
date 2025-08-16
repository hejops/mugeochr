#!/usr/bin/env bash
set -euo pipefail

# generate a json dump of composers on wikidata with birthplace, dob, dod
# (optional)

urlenc() {
	node --eval "console.log(encodeURIComponent(process.argv[1]))" "$1"
}

# https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples

query=$(
	cat <<- EOF
		# SELECT * only returns ?item
		# unknown columns (?) are silently ignored

		# human and humanLabel are hardcoded
		SELECT DISTINCT ?birthplace ?dob ?dod ?humanLabel ?coord
		WHERE {
		# https://github.com/zenon/SparqlExample/blob/89f68c8dad/README.md?plain=1#L40
			?human wdt:P19  ?birthplace .
			?human wdt:P569 ?dob .
			OPTIONAL {?human wdt:P570 ?dod .}
			?human wdt:P106 
				wd:Q36834;     # occupation = composer
				wdt:P1455 ?_ . # has list of works

			# ?human wdt:P101 wd:Q105107008 . # field = composition (not all have field)

		# https://github.com/CarnegieHall/linked-data/blob/b925e24317/sample-wikidata-queries.md?plain=1#L67
			?birthplace wdt:P625 ?coord .

			SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
		} 
		ORDER BY ?dob
	EOF
)

# 0.2 s
curl -Ss -H 'Accept: application/sparql-results+json' "https://query.wikidata.org/sparql?query=$(urlenc "$query")" |
	jq -cr '[.results.bindings[] | {
		name: .humanLabel.value,
		birthplace: .coord.value,
		dob: .dob.value,
		dod: .dod.value,
	}]' |
	sed -r 's/"Point\(([0-9.-]+) ([0-9.-]+)\)"/[\2,\1]/g' > composers.json
