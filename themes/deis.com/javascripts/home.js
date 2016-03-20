$(document).ready(function() {

  // typed.js cli demo
  $(function(){

    $(".deiscli-one").typed({
      stringsElement: $(".deiscli-prompt-one"),
      callback: function() {
        deiscliOne();
        setTimeout(function() {
          deiscliTwo();
        }, 1200);
      }
    });

    function deiscliOne(){
      $(".response-one").show( function(){
        $(".typed-cursor").hide();
        setTimeout(function() {
          $(".response-two").show();
        }, 800);
      })
    };

    function deiscliTwo(){
      $(".deiscli-two").typed({
        stringsElement: $(".deiscli-prompt-two"),
        callback: function() {
          $(".typed-cursor").hide();

          setTimeout(function() {
            verticalAlign()
          }, 16000);

          deiscliThree();
        }
      })
    };

    function deiscliThree(){
      $(".response-three").show( function(){

        setTimeout(function() {
          $(".response-four").show();
        }, 800);
      })

      $(".deiscli-three").typed({
        stringsElement: $(".deiscli-prompt-three")
      })
    };

    function verticalAlign(){
      var outterHeight = $('.deiscli-line-wrap').height();
      var innerHeight = $('.deiscli-line-inner-wrap').height();
      $('.deiscli-line-inner-wrap').addClass('align-bottom');
    }
  });
});
