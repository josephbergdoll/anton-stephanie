

$(document).ready(function() {
  var
    $html = $('html'),
    $body = $('body'),
    $getQuote = $body.find('#get-quote'),
    $submitQuote = $body.find('#submit-quote');

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

   function postContactToGoogle(){
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
            //Success message
          },
          200: function (){
            console.log('success!');
            $('#firstname').val("");
            $('#lastname').val("");
            $('#email').val("");
            $('#attending').prop('checked', false);
            $('#guests').val("");
            //Success Message
          }
        }
      });
    }
    else {
        console.log('error!');
    }
  }

  $('#rsvp-form').submit(function(event) {
    event.preventDefault();
    postContactToGoogle();
  });
  

});