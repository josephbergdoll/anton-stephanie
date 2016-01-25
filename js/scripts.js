
$(document).ready(function() {
  var
    $html = $('html'),
    $body = $('body'),
    $getQuote = $body.find('#get-quote'),
    $submitQuote = $body.find('#submit-quote'),
    rsvpPassword = 'summerlove';
  

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  var documentHtml = function(html){
    // Prepare
    var result = String(html)
      .replace(/<\!DOCTYPE[^>]*>/i, '')
      .replace(/<(html|head|body|title|script)([\s\>])/gi,'<div class="document-$1"$2')
      .replace(/<\/(html|head|body|title|script)\>/gi,'</div>')
    ;
    
    // Return
    return $.trim(result);
  };

   function postContactToGoogle(callback){
    var
      firstname = $('#firstname').val(),
      lastname = $('#lastname').val(),
      email = $('#email').val(),
      guests = $('#guests').val(),
      attending;

      if ($('#attending').is(':checked')) {
        attending = 'Yes';
      }

      console.log(attending);

    if ((firstname !== "") && (lastname !== "") && ((email !== "") && (validateEmail(email)))) {
      $.ajax({
        url: "https://docs.google.com/a/osephj.com/forms/d/1bNc9VUKAtkjpG98LeLn25LpaUEVEqZz5g6Z0qelNkEc/formResponse",
        data: {"entry.1217023847" : firstname, "entry.171952203" : lastname, "entry.1654758078" : email, "entry.73903124": attending, "entry.2102932299" : guests},
        type: "POST",
        dataType: "json",
        statusCode: {
          0: function (){
            console.log('success!');
            $('#firstname').val("");
            $('#lastname').val("");
            $('#email').val("");
            $('#attending').prop('checked', false);
            $('#guests').val("");
            callback();
            //Success message
          },
          200: function (){
            console.log('success!');
            $('#firstname').val("");
            $('#lastname').val("");
            $('#email').val("");
            $('#attending').prop('checked', false);
            $('#guests').val("");
            callback();
            //Success Message
          }
        }
      });
    }
    else {
        console.log('error!');
    }
  }

  $('.js-rsvp-opener').click(function() {
    $(this).velocity('fadeOut', {duration: 200, easing: "easeOutCubic"}).next('.password-prompt-contain').velocity('fadeIn', {delay: 200, duration: 400, easing: "easeOutCubic"});
  });

  $('#password').keydown(function() {
    if ($(this).parent('#rsvp-code').find('.form-helper')) {
      $(this).parent('#rsvp-code').find('.form-helper').remove();
    }
  });

  $('#rsvp-code').submit(function(event) {
    event.preventDefault();
    var password = $('#password').val();

    if (password === rsvpPassword) {
      var rsvpUrl = '/rsvp.html';
      $.ajax({
        url: rsvpUrl,
        success: function(data, textStatus, jqXHR) {
          console.log('success!');
          var
            $data = $(documentHtml(data)),
            $dataBody = $data.find('.document-body:first'),
            $dataContent = $dataBody.find('#rsvp').filter(':first');

          $('#rsvp-code').velocity('slideUp', {duration: 400, easing: "easeOutCubic", queue: false});
          $('#rsvp-code').velocity({opacity: 0}, {duration: 400, easing: "easeOutCubic", queue: false});
          $dataContent.appendTo('#rsvp-wrap');
          $('#rsvp-wrap').velocity('slideDown', {duration: 1000, easing: "easeOutCubic", queue: false});
          $('#rsvp-wrap').velocity({opacity: 1}, {duration: 1000, easing: "easeOutCubic", queue: false});
          $('#rsvp-wrap').velocity('scroll', {delay: 100, duration: 1000, easing: "easeInOutCubic"});
          $(window).trigger('rsvpInserted');
          
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(textStatus + ': ' + errorThrown);
          document.location.href = url;
          return false;
        }
      });
    }
    else {
      var errorHtml = '<div class="form-helper">Incorrect Code</div>';
      $('#rsvp-code').addClass('form-error').append(errorHtml);
      $('#password').val('');
    }
  });

  $(window).on('rsvpInserted', function() {
    $('#lastname').keyup(function() {
      var
        thisVal = $(this).val(),
        val = thisVal.toLowerCase();
      console.log(val);
      if (val.indexOf('anger') != -1 || val.indexOf('van sasse') != -1 || val.indexOf('van sasse van ysselt') != -1) {
        console.log('yes');
        $('body').find('.js-guests').show();
      }
      else {
        $('body').find('.js-guests').hide();
      }
    });

    $('#rsvp-form').submit(function(event) {
      event.preventDefault();
      postContactToGoogle(function() {
        var
          $rsvpParent = $('#rsvp-form').parent(),
          successHtml = '<div id="success" style="display: none;"><h1>Thank you!</h1><p>We&rsquo;ll be in touch soon.</p></div>';
        $('#rsvp-form').velocity('slideUp', {duration: 400, easing: "easeInOutCubic", queue: false});
        $('#rsvp-form').velocity({opacity: 0}, {duration: 400, easing: "easeInOutCubic", queue: false});
        $rsvpParent.append(successHtml);
        $rsvpParent.find('#success').velocity('slideDown', {duration: 400, easing: "easeInOutCubic", queue: false});
        $rsvpParent.find('#success').velocity({opacity: 1}, {duration: 400, easing: "easeInOutCubic", queue: false});
      });
    });
  });

  $(window).load(function() {
    $('.global-loader').velocity('fadeOut', {duration: 2000, delay: 2000, easing: "easeOutCubic"});
    $('#index').velocity('fadeIn', {duration: 2000, delay: 5000, easing: "easeInOutCubic"});
  });

});