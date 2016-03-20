$(document).ready(function() {

  $(document).foundation();

  // Registers a jQuery method "textMetrics"
  // which calculates the height and width of a text string
  (function($) {
    $.textMetrics = function(el) {
      var h = 0, w = 0;
      var div = document.createElement('div');

      document.body.appendChild(div);
      $(div).css({
        position: 'absolute',
        left: -1000,
        top: -1000,
        display: 'none'
      });

      $(div).html($(el).html());
      var styles = ['font-size','font-style', 'font-weight',
        'font-family','line-height', 'text-transform', 'letter-spacing'];
      $(styles).each(function() {
        var s = this.toString();
        $(div).css(s, $(el).css(s));
      });

      h = $(div).outerHeight();
      w = $(div).outerWidth();

      $(div).remove();

      return {
        height: h,
        width: w
      };
    }
  })(jQuery);
});

window.onload = function () {
  // Rationalize home page "Why" panel sub-headings underlines
  (function () {
    $.each($('.panel--why h3'), function (i, h3) {
      var width = $.textMetrics(h3).width || 0;
      $('head').append('<style>.features.row div:nth-child(' + (i + 1) +
        ') h3:after{width: ' + width + 'px;margin-left: -' +
        (width / 2) + 'px;' + getFadeInString(1) + '}</style>');
    });
  }());
  // Rationalize community page title heading underline
  (function () {
    var queryString = '#community h1';
    var width = $.textMetrics(queryString).width || 0;
    $('head').append('<style>' + queryString + ':after{width: ' +
      width + 'px;margin-left: -' + (width / 2) + 'px;' + getFadeInString(1) + '}</style>');
  }());

  function getFadeInString (time) {
    return '-webkit-animation: fadein ' + time + 's;' +
        '-moz-animation: fadein ' + time + 's;' +
        '-ms-animation: fadein ' + time + 's;' +
        '-o-animation: fadein ' + time + 's;' +
        'animation: fadein ' + time + 's;'
  }
};
