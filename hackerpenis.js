var stringIndex = 0;
var nutWidth = 15;
var shaftHeight = 20;
var dataString = "";
var cursorIndex = 0;
var nutEndReached = false;
var lineEndReached = false;
var linesPrinted = 0;
var state = 'BALLS'; // BALLS, SHAFT
var inShaft = false;

function reqListener () {
  dataString = this.responseText;
}

var inputFile = new XMLHttpRequest();
inputFile.addEventListener("load", reqListener);
inputFile.open("GET", "HPinput.txt");
inputFile.send();

$(document).on('keypress touchstart', (function() {
  if (state == 'BALLS') {
    for (var i = 0; i < nutWidth / 3; ++i) {
      // space between nuts
      if (nutEndReached) {
        $('#mainWindow').append("&nbsp;");
      }
      // main meat of the nuts
      else {
        $('#mainWindow').append(dataString[stringIndex]);
        stringIndex++;
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
        $('#mainWindow').append("<br/ >");
        linesPrinted++;
        cursorIndex = 0;
      }
      // end of nuts 
      if (linesPrinted == Math.ceil(nutWidth / 2)) {
        console.log('end of nuts');
        state = "SHAFT";
        for (var i = 0; i < ((nutWidth * 2) / 3) - 1; ++i) {
          $('#mainWindow').append("&nbsp;");
          cursorIndex = ((nutWidth * 2) / 3) - 1;
        }
        linesPrinted = 0;
      }
    }
  }
  else if (state == "SHAFT") {
    for (var i = 0; i < nutWidth / 3; ++i) {
      $('#mainWindow').append(dataString[stringIndex]);
      stringIndex++;
      cursorIndex++;
      if (cursorIndex == (((nutWidth * 2) / 3) + nutWidth + 1)) {
        console.log('end of shaft line');
        $('#mainWindow').append("<br/ >");
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
        $('#mainWindow').append("<br/ ><br/ >");
      }
    }
  }
  console.log('index: ', cursorIndex);
  window.scrollTo(0, document.body.scrollHeight);
}));