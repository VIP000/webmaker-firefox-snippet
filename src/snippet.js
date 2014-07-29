// console.log(DEBUG = true);

/*global window, $, CSS_COLORS*/
/*exported Snippet*/
var Snippet = (function() {
  var remixed = false;
  var setTimeout = window.setTimeout;
  var inCruiseControl = false;
  var wasCssTinkeredWith = false;
  var initialColor = "Gold";
  var onColorChange;

  var afterClickDelay = 1500;
  var afterTypeDelay = 1500;
  var flyoutDisplayTime = 5000;
  var delayBeforeEnd = 1500;

  // from http://24ways.org/2010/calculating-color-contrast/
  function isDark(cssString){
	  var hex = cssString.replace('#', '');
    var r = parseInt(hex.substr(0,2),16);
	  var g = parseInt(hex.substr(2,2),16);
	  var b = parseInt(hex.substr(4,2),16);
	  var yiq = ((r*299) + (g*587) + (b*114)) / 1000;
	  return yiq <= 128;
  }

  function setCss() {
    var css = $('#snippet-css').val().toLowerCase();
    var $snippet = $('.snippet');
    var hex = CSS_COLORS[css];

    if (!hex) return;

    if (isDark(hex)) {
      $snippet.addClass('dark');
    } else {
      $snippet.removeClass('dark');
    }

    if (!css) {
      $snippet.removeClass('dark');
    }

    if (onColorChange && css != initialColor.toLowerCase())
      onColorChange(hex);

    $('body').css('background', hex);
  }

  function typeCssChars(chars, cb, delay) {
    var $snippetCss = $('#snippet-css');
    chars = chars.split('');

    function typeNextChar() {
      if (chars.length === 0) {
        return setTimeout(cb, delay || 0);
      }
      $snippetCss.val($snippetCss.val() + chars.shift());
      setCss();
      setTimeout(typeNextChar, 333);
    }

    $snippetCss.val('');
    typeNextChar();
  }

  function bounceIcon(wait) {
    setTimeout(function(){
      $('.snippet .icon').addClass('bounce');
    }, wait || 0);
  }

  function startRemixing() {
    if (remixed) return false;
    remixed = true;

    var $snippetCss = $('#snippet-css');

    inCruiseControl = true;
    $('#snippet-pg-1').fadeOut(function() {
      $('#snippet-pg-2').fadeIn(function() {
        $snippetCss.focus();

        if (typeof DEBUG !== 'undefined') {
          inCruiseControl = false;
          return;
        }

        setTimeout(function() {
          $snippetCss.focus();
          typeCssChars(initialColor, function afterGhostWriter() {
            $('.body-frame').addClass('selected');
            $('.body-frame .arrow-box')
              .addClass('selected')
              .one('transitionend', function afterInitialClick() {
                setTimeout(function afterDelay() {

                  $('.body-frame, .arrow-box').removeClass('selected');

                  $('.snippet .arrow-box').addClass('selected');
                  $snippetCss.select();
                  inCruiseControl = false;

                  onColorChange = function() {
                    onColorChange = null;
                    $snippetCss.typeahead('close');
                    bounceIcon();
                    setTimeout(function () {
                      $('#snippet-end').addClass('selected');
                    }, delayBeforeEnd);
                  };

                }, flyoutDisplayTime);
              });
          }, afterTypeDelay);
        }, afterClickDelay);
      });
    });
  }

  function activateTypeahead() {
    // http://twitter.github.io/typeahead.js/examples/
    var substringMatcher = function(strs) {
      return function findMatches(q, cb) {
        var matches, substrRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
          if (substrRegex.test(str)) {
            // the typeahead jQuery plugin expects suggestions to a
            // JavaScript object, refer to typeahead docs for more info
            matches.push({ value: str });
          }
        });

        cb(matches);
      };
    };

    $('#snippet-css').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    }, {
      name: 'colors',
      displayKey: 'value',
      source: substringMatcher(Object.keys(CSS_COLORS).sort())
    });

    // Uncomment this to debug styling.
    // $('#snippet-css').focus().typeahead('val', 'gray').typeahead('open');
  }

  function start() {
    var $snippetCss = $('#snippet-css');
    activateTypeahead();
    $snippetCss.on('keyup change', setCss);
    $snippetCss.on('keydown', function(e) {
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (inCruiseControl) return false;
        if (!wasCssTinkeredWith) {
          $('.snippet .arrow-box').removeClass('selected');
          wasCssTinkeredWith = true;
        }
      }
    });
    $("#snippet-begin").click(function() {
      startRemixing();
      return false;
    });
  }

  return { start: start };
})();
