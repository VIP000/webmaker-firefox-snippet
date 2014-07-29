/*global window, jQuery*/
(function($) {
  var CSS_COLORS = {
    "aqua": "#00ffff",
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "black": "#000000",
    "blue": "#0000ff",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgreen": "#006400",
    "darkturquoise": "#00ced1",
    "deepskyblue": "#00bfff",
    "green": "#008000",
    "lime": "#00ff00",
    "mediumblue": "#0000cd",
    "mediumspringgreen": "#00fa9a",
    "navy": "#000080",
    "springgreen": "#00ff7f",
    "teal": "#008080",
    "midnightblue": "#191970",
    "dodgerblue": "#1e90ff",
    "lightseagreen": "#20b2aa",
    "forestgreen": "#228b22",
    "seagreen": "#2e8b57",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "limegreen": "#32cd32",
    "mediumseagreen": "#3cb371",
    "turquoise": "#40e0d0",
    "royalblue": "#4169e1",
    "steelblue": "#4682b4",
    "darkslateblue": "#483d8b",
    "mediumturquoise": "#48d1cc",
    "indigo": "#4b0082",
    "darkolivegreen": "#556b2f",
    "cadetblue": "#5f9ea0",
    "cornflowerblue": "#6495ed",
    "mediumaquamarine": "#66cdaa",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "slateblue": "#6a5acd",
    "olivedrab": "#6b8e23",
    "slategray": "#708090",
    "slategrey": "#708090",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "mediumslateblue": "#7b68ee",
    "lawngreen": "#7cfc00",
    "aquamarine": "#7fffd4",
    "chartreuse": "#7fff00",
    "gray": "#808080",
    "grey": "#808080",
    "maroon": "#800000",
    "olive": "#808000",
    "purple": "#800080",
    "lightskyblue": "#87cefa",
    "skyblue": "#87ceeb",
    "blueviolet": "#8a2be2",
    "darkmagenta": "#8b008b",
    "darkred": "#8b0000",
    "saddlebrown": "#8b4513",
    "darkseagreen": "#8fbc8f",
    "lightgreen": "#90ee90",
    "mediumpurple": "#9370db",
    "darkviolet": "#9400d3",
    "palegreen": "#98fb98",
    "darkorchid": "#9932cc",
    "yellowgreen": "#9acd32",
    "sienna": "#a0522d",
    "brown": "#a52a2a",
    "darkgray": "#a9a9a9",
    "darkgrey": "#a9a9a9",
    "greenyellow": "#adff2f",
    "lightblue": "#add8e6",
    "paleturquoise": "#afeeee",
    "lightsteelblue": "#b0c4de",
    "powderblue": "#b0e0e6",
    "firebrick": "#b22222",
    "darkgoldenrod": "#b8860b",
    "mediumorchid": "#ba55d3",
    "rosybrown": "#bc8f8f",
    "darkkhaki": "#bdb76b",
    "silver": "#c0c0c0",
    "mediumvioletred": "#c71585",
    "indianred": "#cd5c5c",
    "peru": "#cd853f",
    "chocolate": "#d2691e",
    "tan": "#d2b48c",
    "lightgray": "#d3d3d3",
    "lightgrey": "#d3d3d3",
    "thistle": "#d8bfd8",
    "goldenrod": "#daa520",
    "orchid": "#da70d6",
    "palevioletred": "#db7093",
    "crimson": "#dc143c",
    "gainsboro": "#dcdcdc",
    "plum": "#dda0dd",
    "burlywood": "#deb887",
    "lightcyan": "#e0ffff",
    "lavender": "#e6e6fa",
    "darksalmon": "#e9967a",
    "palegoldenrod": "#eee8aa",
    "violet": "#ee82ee",
    "azure": "#f0ffff",
    "honeydew": "#f0fff0",
    "khaki": "#f0e68c",
    "lightcoral": "#f08080",
    "sandybrown": "#f4a460",
    "beige": "#f5f5dc",
    "mintcream": "#f5fffa",
    "wheat": "#f5deb3",
    "whitesmoke": "#f5f5f5",
    "ghostwhite": "#f8f8ff",
    "lightgoldenrodyellow": "#fafad2",
    "linen": "#faf0e6",
    "salmon": "#fa8072",
    "oldlace": "#fdf5e6",
    "bisque": "#ffe4c4",
    "blanchedalmond": "#ffebcd",
    "coral": "#ff7f50",
    "cornsilk": "#fff8dc",
    "darkorange": "#ff8c00",
    "deeppink": "#ff1493",
    "floralwhite": "#fffaf0",
    "fuchsia": "#ff00ff",
    "gold": "#ffd700",
    "hotpink": "#ff69b4",
    "ivory": "#fffff0",
    "lavenderblush": "#fff0f5",
    "lemonchiffon": "#fffacd",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightyellow": "#ffffe0",
    "magenta": "#ff00ff",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "pink": "#ffc0cb",
    "red": "#ff0000",
    "seashell": "#fff5ee",
    "snow": "#fffafa",
    "tomato": "#ff6347",
    "white": "#ffffff",
    "yellow": "#ffff00",

    // http://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/
    "rebeccapurple": "#663399"
  };

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

  // Attach start handler to document ready
  $(function start() {
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
  });

})(jQuery);
