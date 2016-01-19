

$(document).ready(function() {
  var
    $html = $('html'),
    $body = $('body'),
    $getQuote = $body.find('#get-quote'),
    $submitQuote = $body.find('#submit-quote');

  $.fn.openSelect = function() {
    var
      $body = $('body'),
      $options = $(this).find('.select-options'),
      showOptionsClass = 'show-options',
      $keyboardTrigger = $(this).find('.js-keyboard-trigger');
    if ($body.find('.'+showOptionsClass)) {
      closeSelect();
    }
    if (!$(this).hasClass(showOptionsClass)) {
      $(this).addClass(showOptionsClass);
      $options.attr('tabindex', '0');
      $options.velocity('slideDown', {duration: 300, easing: "easeOutCubic", queue: false});
      $options.velocity({opacity: 1}, {duration: 300, easing: "easeOutCubic", queue: false, complete:
        function() {
          $keyboardTrigger.attr('tabindex', '-1');
          $options.focus();
        }
      });
    }
    return this;
  };

  function closeSelect() {
    var
      $body = $('body'),
      showOptionsClass = 'show-options';
    if ($body.find('.'+showOptionsClass)) {
      var
        $openOptions = $body.find('.'+showOptionsClass),
        $options = $openOptions.find('.select-options'),
        $keyboardTrigger = $openOptions.find('.js-keyboard-trigger');
      $openOptions.removeClass(showOptionsClass);
      $options.velocity('fadeOut', {duration: 200, easing: "easeOutCubic"});
      $options.attr('tabindex', '-1');
      $keyboardTrigger.attr('tabindex', '0');
    }
  }

  $getQuote.find('.js-pretty-select').each(function() {
    var
      $prettySelect = $(this),
      $realSelect = $prettySelect.find('.js-select'),
      value = $realSelect.val(),
      valueLabel = $realSelect.find('option:selected').text(),
      $selected = $prettySelect.find('.selected-option'),
      $options = $prettySelect.find('.select-options'),
      $keyboardTrigger = $prettySelect.find('.js-keyboard-trigger'),
      showOptionsClass = 'show-options',
      validClass = 'valid',
      selectedClass = 'selected';

    if (value != null || value != undefined) {
      var $selectedOption = $options.find('li[data-value="'+value+'"]');
      $selected.text(valueLabel);
      $selectedOption.addClass(selectedClass);
      $prettySelect.addClass(validClass);
    }
    else {
      var placeholder = $realSelect.find('option:first').text();
      $selected.text(placeholder);
    }

    $keyboardTrigger.off('focusin').focusin(function() {
      $keyboardTrigger.focusout();
      $prettySelect.openSelect();
    });

    $selected.on('click', function(e) {
      e.preventDefault();
      $prettySelect.openSelect();
    });

    $options.focusin(function() {

      $(window).keydown(function(e) {
        var
          $option = $options.find('li'),
          $optionHeight = $option.first().outerHeight(),
          highlightClass = 'highlight',
          highlightSelector = '.highlight',
          optionsHeight = $options.outerHeight(),
          scrolledPoint = $options.scrollTop();

        if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 13) {
          e.preventDefault();
        }
        // Down Arrow
        if (e.keyCode === 40) {
          console.log('down arrow');
          if (!$options.find(highlightSelector).length) {
            console.log('no highlight yet');
            $options.find('li:first').addClass(highlightClass);
            var scrollDistance = $options.find(highlightSelector).position().top;
            if (scrollDistance > optionsHeight) {
              $options.scrollTop(scrollDistance + optionsHeight * 3);
            }
            else if (scrollDistance < scrolledPoint) {
              $options.scrollTop(scrollDistance - optionsHeight * 3);
            }
          }
          else {
            $options.find(highlightSelector).removeClass(highlightClass).next().addClass(highlightClass);
            var scrollDistance = $options.find(highlightSelector).position().top;
            if (scrollDistance > optionsHeight) {
              $options.scrollTop(scrollDistance + optionsHeight * 3);
            }
            else if (scrollDistance < scrolledPoint) {
              $options.scrollTop(scrollDistance - optionsHeight * 3);
            }
          }

        }
        // Up Arrow
        else if (e.keyCode === 38) {
          console.log('up arrow');
          if (!$options.find(highlightSelector).length) {
            console.log('no highlight yet');
            $options.find('li:last').addClass(highlightClass);
            var scrollDistance = $options.find(highlightSelector).position().top;
            if (scrollDistance > optionsHeight) {
              $options.scrollTop(scrollDistance + optionsHeight * 3);
            }
            else if (scrollDistance < scrolledPoint) {
              $options.scrollTop(scrollDistance - optionsHeight * 3);
            }
          }
          else {
            $options.find(highlightSelector).removeClass(highlightClass).prev().addClass(highlightClass);
            var scrollDistance = $options.find(highlightSelector).position().top;
            if (scrollDistance > optionsHeight) {
              $options.scrollTop(scrollDistance + optionsHeight * 3);
            }
            else if (scrollDistance < scrolledPoint) {
              $options.scrollTop(scrollDistance - optionsHeight * 3);
            }
          }
        }
        // Enter Key
        else if (e.keyCode === 13) {
          $options.find(highlightSelector).trigger('click');
        }

      });
    });

    $options.focusout(function() {
      closeSelect();
    });

    $options.find('li').click(function(e) {
      e.preventDefault();
      var
        selectedValue = e.target.dataset.value;
      $realSelect.val(selectedValue);
      $realSelect.trigger('change');
      $options.velocity('fadeOut', {duration: 300, easing: "easeOutCubic", queue: false});
    });

    $realSelect.change(function(event) {
      var
        valueSelected = this.value,
        $selectedOption = $options.find('li[data-value="'+valueSelected+'"]'),
        selectedText = $selectedOption.text();
      $options.find('.'+selectedClass).removeClass(selectedClass);
      $selectedOption.addClass(selectedClass);
      $selected.text(selectedText);
      $prettySelect.addClass(validClass);
      if ($prettySelect.hasClass(showOptionsClass)) {
        $prettySelect.removeClass(showOptionsClass);
      }
      if ($realSelect.parents('.pretty-select').attr('id') === 'product-select' && $getQuote.find('.quote-form').hasClass('invalid')) {
        $getQuote.find('quote-form').removeClass('invalid');
        $submitQuote.prop('disabled', false);
      }
    });
  });

  $submitQuote.click(function(e) {
    e.preventDefault();
    var 
      state = $getQuote.find('select#quote-state').val(),
      product = $getQuote.find('select#quote-product').val(),
      nwQuoteUrl = 'https://getquote.nationwide.com/qrp-web/qrpAction.action?NI.qt_st=&productType='+product+'&state='+state+'&quoteType=initiateQuote&NI.qt_prod=Auto&submitButtonName=Go&pdsNumber=020027684&WT.mc_id=NW_SC_Agt_FB-MainPromo_Facebook_Banner_813x311_Get-A-Quote_All_All&WT.tsrc=SclAgt';
    $submitQuote.text('Loading Quote...').prop('disabled', true);
    $getQuote.addClass('quote-loading');
    setTimeout(function() {
      var win = window.open(nwQuoteUrl, 'new');
      $submitQuote.text('Start Quote').prop('disabled', false);
      $getQuote.removeClass('quote-loading');
      if (win) {
        win.focus();
      }
      else {
        window.location.href = nwQuoteUrl;
      }
    }, 300);
    
  });


  $(window).scroll(function() {
    var
      st = $(window).scrollTop(),
      $header = $body.find('.header-main'),
      headerHeight = $header.outerHeight(),
      currentMenuClass = 'current-menu-item',
      currentMenuSelector = '.' + currentMenuClass,
      quoteHeight = $body.find('#get-quote').outerHeight(),
      aboutOffset = $body.find('#about').offset().top,
      contactOffset = $body.find('#contact').offset().top;
    if (st > (quoteHeight - headerHeight) && !$header.hasClass('scrolled')) {
      $header.addClass('scrolled');
    }
    else if (st < (quoteHeight - headerHeight) && $header.hasClass('scrolled')) {
      $header.removeClass('scrolled');
    }

    if (st >= aboutOffset - headerHeight && st < contactOffset - headerHeight) {
      $body.find(currentMenuSelector).removeClass(currentMenuClass);
      $('.nav-main a[href="/#about"').addClass(currentMenuClass);
    }
    else if (st >= contactOffset - headerHeight) {
      $body.find(currentMenuSelector).removeClass(currentMenuClass);
      $('.nav-main a[href="/#contact"').addClass(currentMenuClass);
    }
    else if (st < aboutOffset - headerHeight) {
      $body.find(currentMenuSelector).removeClass(currentMenuClass);
      $('.nav-main a[href="/#get-quote"').addClass(currentMenuClass);
    }
  });

  $body.find('.nav-main').on('click', 'a', function(e) {
    e.preventDefault();
    var href = e.currentTarget.hash;
    $(href).velocity('scroll', {duration: 500, easing: "easeInOutCubic"});
  });

  

});

