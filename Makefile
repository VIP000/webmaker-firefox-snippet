bundle: snippet-html snippet
	@cat jquery.custom.min.js typeahead.jquery.min.js snippet.min.js | uglifyjs > bundle.js

snippet: snippet-html
	@cat snippet-html.js css-colors.js snippet.js |\
	  uglifyjs -m -r "Snippet" --screw-ie8 > snippet.min.js

snippet-html:
	@echo var SNIPPET_HTML=\'`tr -d '\n' < snippet.html`\' > snippet-html.js

count-bytes: bundle
	@echo $(shell wc -c < bundle.js | tr -d ' ') bytes \
		"("$(shell gzip < bundle.js | wc -c | tr -d ' ') "gzipped)"
