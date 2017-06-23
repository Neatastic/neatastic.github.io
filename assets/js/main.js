var previousScrollPosition = false;
var audioOn = false;

var t
$('document').ready(function () {
  $('.ui.sidebar')
  .sidebar({
    dimPage: true,
    closable: true,
    transition: 'overlay'
  });
  $('.ui.dropdown')
  .dropdown({
    on: 'hover',
    action: 'hide'
  });
  $('.altion.image, .altion.video')
  .popup({
  })
  ;
  $('.altion.audio').mouseenter(function (event) {
    if (!audioOn) {
      var audio = new Audio( event.currentTarget.getAttribute('data-source'));
      audioOn = true;
      audio.play();
      audio.onended = function() {
        audioOn = false
        alert("The audio has ended");
      };
    }
})
})

resetTimer()

function logout() {
  //if no animation, dialog, and we are landed
  resetEyes()
};

function resetTimer() {
  //console.log("pristine sky : " + pristineSky);

  clearTimeout(t);

  t = setTimeout(logout, 5000);
}

$(function() {
  var $window = $(window),
  $body = $('body');

  // Disable animations/transitions until the page has loaded.
  $body.addClass('is-loading');
  NProgress.start();
  $window.on('load', function() {
    $body.removeClass('is-loading');
    NProgress.done();
  });
});
/* USELESS BUT COOL
$(window).on('breakpoint-change', function(e, breakpoint) {
console.log("BREAKPOINT CHANGE :" + breakpoint);
var my = $('.ui.sidebar');
var pusher = $('.pusher');
//BUG for some reason they are quote wrapping the breakpoint name
breakpoint = breakpoint.slice(1, breakpoint.length - 1);
switch (breakpoint) {
case 'xxs-width':
if (my.sidebar('is visible')) my.sidebar('hide');
my.removeClass(['very', 'wide','visible']);
pusher.css({
'margin-right': 0,
'padding':'0.1em'
});
break;
case 'xs-width':
if (my.sidebar('is visible')) my.sidebar('hide');
my.removeClass(['very', 'wide','visible']);
pusher.css({
'margin-right': 0,
'padding':'3em 1em 3em 3em'
});
break;
case 's-width':
if (my.sidebar('is visible')) my.sidebar('hide');
my.removeClass(['very', 'wide','visible']);
pusher.css({
'margin-right': 0,
'padding':'3em 1em 3em 3em'
});
break;
case 'sm-width':
if (my.sidebar('is visible')) my.sidebar('hide');
my.removeClass(['very', 'wide','visible']);
pusher.css({
'margin-right': 0,
'padding':'3em 1em 3em 3em'
});
break;
case 'md-width':
if (my.sidebar('is hidden')) my.sidebar('show');
my.removeClass(['very', 'wide']);
pusher.css({
'margin-right': 260,
'padding':'1em 1em 3em 3em'
});
break;
case 'lg-width':
my.removeClass(['very', 'wide']).addClass('visible');
pusher.css({
'margin-right': 260,
'padding':'1em 1em 3em 3em'
});
break;
case 'xl-width':
my.removeClass(['very', 'wide']).addClass('visible');
pusher.css({
'margin-right': 350,
'padding':'1em 1em 3em 3em'
});
my.removeClass('very').addClass(['wide','visible']);
break;
case 'xxl-width':
pusher.css({
'margin-right': 475,
'padding':'1em 1em 3em 3em'
});
my.addClass(['very', 'wide', 'visible']);

break;

default:
console.log('it does not works like that');

}
});
*/
