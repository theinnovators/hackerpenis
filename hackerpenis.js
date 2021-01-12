const BALLS_SMALL = 3;
const BALLS_MEDIUM = 6;
const BALLS_LARGE = 9;
const BALLS_XLARGE = 12;
const SHAFT_SMALL = 5;
const SHAFT_MEDIUM = 10;
const SHAFT_LARGE = 15;
const SHAFT_XLARGE = 20;

var nutWidth = BALLS_MEDIUM;
var shaftHeight = SHAFT_MEDIUM;
var stringIndex = 0;
var dataString = '';
var cursorIndex = 0;
var nutEndReached = false;
var lineEndReached = false;
var linesPrinted = 0;
var state = 'BALLS'; // BALLS, SHAFT
var inShaft = false;
var pendingWidth = '';
var pendingHeight = '';

// heavily copied from SO ;)
function reqListener () {
  dataString = this.responseText;
}

var inputFile = new XMLHttpRequest();
inputFile.addEventListener('load', reqListener);
inputFile.open('GET', 'HPinput.txt');
inputFile.send();

$(document).ready(function() {
  var bodyHeight = $(document).outerHeight();
  var headerHeight = $('#header').outerHeight();
  var settingsHeight = $('#settings').outerHeight();
  var bodyMargin = parseInt($(document.body).css('margin-top'));
  $('#mainWindowContainer').innerHeight(bodyHeight - settingsHeight - 
                                        headerHeight - bodyMargin);
  $('input').change(function() {
    if (this.name == 'width') {
      if (stringIndex == 0) changeWidth(this.id);
      else {
        pendingWidth = this.id;
        return;
      }
    }
    else {
      if (stringIndex == 0) changeHeight(this.id);
      else {
        pendingHeight = this.id;
        return;
      }
    }
  });
  $('.no-zoom').bind('touchend', function(e) {
    e.preventDefault();
  });
});

function changeWidth(newWidth) {
  switch(newWidth) {
    case 'widthS':
      nutWidth = BALLS_SMALL;
      break;
    case 'widthM':
      nutWidth = BALLS_MEDIUM;
      break;
    case 'widthL':
      nutWidth = BALLS_LARGE;
      break;
    case 'widthXL':
      nutWidth = BALLS_XLARGE;
      break;
    default:
      break;
  }
  pendingWidth = '';
}

function changeHeight(newHeight) {
  switch(newHeight) {
    case 'heightS':
      shaftHeight = SHAFT_SMALL;
      break;
    case 'heightM':
      shaftHeight = SHAFT_MEDIUM;
      break;
    case 'heightL':
      shaftHeight = SHAFT_LARGE;
      break;
    case 'heightXL':
      shaftHeight = SHAFT_XLARGE;
      break;
    default:
      break;
  }
  pendingHeight = '';
}

$(document).on('keyup touchend', (function(event) {
  // only add text if touch is on main area
  if ($(event.target).parents('#settings').length) return;
  
  /*if (event.type == 'touchend' && 
      !(event.target.tagName == 'HTML' || 
        event.target.tagName == 'SPAN')) return;*/
  for (var numChars = 0; numChars < 3; ++numChars) {
    if (state == 'BALLS') {
      for (var i = 0; i < nutWidth / 3; ++i) {
        // space between nuts
        if (nutEndReached) {
          $('#mainWindow').append("&nbsp;");
        }
        // main meat of the nuts
        else {
          $('.tinyAd').first().clone().appendTo('#tinyAdContainer')
          // $('#mainWindow').append(dataString[stringIndex]);
          // stringIndex++;
        }
        cursorIndex++;

        // end of first nut
        if (cursorIndex == nutWidth) {
          nutEndReached = true;
          //console.log('end reached');
        }
        // beginning of second nut
        else if (cursorIndex == nutWidth + nutWidth / 3) {
          nutEndReached = false;
          //console.log('beginning reached');
        }
        // end of line
        else if (cursorIndex == nutWidth * 2 + nutWidth / 3) {
          lineEndReached = true;
          console.log('line end reached');
          $('#mainWindow').append("<br/>");
          linesPrinted++;
          cursorIndex = 0;
        }
        // end of nuts 
        if (linesPrinted == Math.ceil(nutWidth / 2)) {
          console.log('end of nuts');
          state = 'SHAFT';
          for (var i = 0; i < ((nutWidth * 2) / 3) - 1; ++i) {
            $('#mainWindow').append("&nbsp;");
            cursorIndex = ((nutWidth * 2) / 3) - 1;
          }
          linesPrinted = 0;
        }
      }
    }
    else if (state == 'SHAFT') {
      for (var i = 0; i < nutWidth / 3; ++i) {
        $('#mainWindow').append(dataString[stringIndex]);
        stringIndex++;
        cursorIndex++;
        if (cursorIndex == (((nutWidth * 2) / 3) + nutWidth + 1)) {
          console.log('end of shaft line');
          $('#mainWindow').append("<br/>");
          linesPrinted++;
          for (var i = 0; i < ((nutWidth * 2) / 3) - 1; ++i) {
            $('#mainWindow').append("&nbsp;");
            cursorIndex = ((nutWidth * 2) / 3) - 1;
          }
        }
        if (linesPrinted == shaftHeight) {
          console.log('end of shaft');
          state = 'BALLS';
          cursorIndex = 0;
          linesPrinted = 0;
          $('#mainWindow').append("<br/><br/>");
          if (pendingWidth != '') {
            changeWidth(pendingWidth);
          }
          if (pendingHeight != '') {
            changeHeight(pendingHeight);
          }
        }
      }
    }
    // keep scroll focus at bottom of page
    var windowHeight = $('#mainWindowContainer')[0].scrollHeight;
    $('#mainWindowContainer').scrollTop(windowHeight);
    
    // old method of keeping scroll focus, eventually hides settings
    //window.scrollTo(0, document.body.scrollHeight);
  }
}));

// prevent double tap zoom on mobile - big ol copied from SO
$.fn.nodoubletapzoom = function () {
  $(this).bind('touchstart', function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = $(this).data('lastTouch') || t2;
    var dt = t2 - t1;
    var fingers = e.originalEvent.touches.length;
    $(this).data('lastTouch', t2);
    if (!dt || dt > 500 || fingers > 1) {
      return; // not double-tap
    }
    e.preventDefault(); // double tap - prevent the zoom
    // also synthesize click events we just swallowed up
    $(e.target).trigger('click');
  });
};
$('body').nodoubletapzoom();