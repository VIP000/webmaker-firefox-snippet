/*global window, $, CSS_COLORS*/
/*exported Snippet*/
var Snippet = (function() {
  var setTimeout = window.setTimeout;
  var inCruiseControl = false;
  var wasCssTinkeredWith = false;
  var initialColor = "LightSkyBlue";

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
    var css = $('#snippet-css').val();
    var $snippet = $('.snippet');
    // http://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/
    if (/^(re)?beccapurple$/i.test(css.trim()))
      css = '#663399';

    var hex = CSS_COLORS[css.toLowerCase()];
    if (hex) {
      if (isDark(hex)) {
        $snippet.addClass('dark');
      } else {
        $snippet.removeClass('dark');
      }
    }

    if (!css) {
      $snippet.removeClass('dark');
    }

    $('body').css('background', css);
  }

  function typeCssChars(chars, cb) {
    var $snippetCss = $('#snippet-css');
    chars = chars.split('');

    function typeNextChar() {
      if (chars.length === 0) return cb();
      $snippetCss.val($snippetCss.val() + chars.shift());
      setCss();
      setTimeout(typeNextChar, 250);
    }

    $snippetCss.val('');
    typeNextChar();
  }

  function showIcon(wait) {
    setTimeout(function(){
      $('.snippet .icon').addClass('bounce');
    }, wait || 0);
  }
  window.showIcon = showIcon;

  function startRemixing() {
    inCruiseControl = true;
    $('#snippet-pg-1').fadeOut(function() {
      $('#snippet-pg-2').fadeIn(function() {
        $('#snippet-css').focus();

        if (typeof DEBUG_MODE !== 'undefined') {
          inCruiseControl = false;
          return;
        }
        $('.body-frame').addClass('selected');
        setTimeout(function() {
          $('.body-frame .arrow-box')
            .addClass('selected')
            .one('transitionend', function() {
              typeCssChars(initialColor, function() {
                inCruiseControl = false;
                setTimeout(function() {
                  showIcon(2000);
                  $('.body-frame, .arrow-box').removeClass('selected');
                  $('#snippet-end').addClass('selected');
                  setTimeout(function() {
                    if (!wasCssTinkeredWith)
                      $('.snippet .arrow-box').addClass('selected');
                  }, 4000);
                }, 2500);
              });
            });
        }, 1000);
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
