JQUERY_VERSION = 2.1.1
JQUERY_REPO = git@github.com:jquery/jquery.git
JQUERY_DIST_DIR = ./jquery/dist
GRUNT_BIN = ./node_modules/.bin/grunt # from JQUERY_DIST_DIR
CUSTOM_BUILD_OPTIONS = custom:-exports/amd,-serialize,-offset,-ajax,-deprecated,-sizzle
LOGO_PATH = ./webmaker-logo.png

bundle.js: jquery.custom.min.js snippet.min.js
	cat jquery.custom.min.js typeahead.jquery.min.js snippet.min.js | uglifyjs > bundle.js

snippet.min.js:
	cat css-colors.js snippet.js |\
	  uglifyjs -m -r "Snippet" --screw-ie8 > snippet.min.js

jquery:
	git clone -b $(JQUERY_VERSION) --single-branch --depth=1  $(JQUERY_REPO)
	cd jquery && npm install

jquery.custom.min.js: jquery
	cd jquery && $(GRUNT_BIN) $(CUSTOM_BUILD_OPTIONS)
	sed '$$d' $(JQUERY_DIST_DIR)/jquery.min.js > jquery.custom.min.js

image-dataurl:
	@printf 'data:image/png;base64,' >$(LOGO_PATH).datauri
	@base64 <$(LOGO_PATH) | tr -d "\n" >>$(LOGO_PATH).datauri
	@cat $(LOGO_PATH).datauri

count-bytes: bundle.js
	@echo $(shell wc -c < bundle.js | tr -d ' ') bytes \
		"("$(shell gzip < bundle.js | wc -c | tr -d ' ') "gzipped)"

clean:
	rm bundle.js
	rm snippet.min.js
	rm jquery.custom.min.js

.PHONY: count-bytes clean image-dataurl
