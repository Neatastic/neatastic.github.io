// logo eyes animation variables

var circle1 = document.getElementById("eye1");
var circle2 = document.getElementById("eye2");
var circle3 = document.getElementById("eye3");
var circlePosition1 = circle1.getBoundingClientRect();
var circlePosition2 = circle2.getBoundingClientRect();
var circlePosition3 = circle3.getBoundingClientRect();

var circleCenterX1 = circlePosition1.left + (circlePosition1.width / 2);
var circleCenterY1 = circlePosition1.top + (circlePosition1.width / 2);

var circleCenterX2 = circlePosition2.left + (circlePosition2.width / 2);
var circleCenterY2 = circlePosition2.top + (circlePosition2.width / 2);

var circleCenterX3 = circlePosition3.left + (circlePosition3.width / 2);
var circleCenterY3 = circlePosition3.top + (circlePosition3.width / 2);


// refresh values if window is resized
window.onresize = function(event) {
  circle1 = document.getElementById("eye1");
  circle2 = document.getElementById("eye2");
  circle3 = document.getElementById("eye3");

  circlePosition1 = circle1.getBoundingClientRect();
  circlePosition2 = circle2.getBoundingClientRect();
  circlePosition3 = circle3.getBoundingClientRect();

  circleCenterX1 = circlePosition1.left + (circlePosition1.width / 2);
  circleCenterY1 = circlePosition1.top + (circlePosition1.width / 2);

  circleCenterX2 = circlePosition2.left + (circlePosition2.width / 2);
  circleCenterY2 = circlePosition2.top + (circlePosition2.width / 2);

  circleCenterX3 = circlePosition3.left + (circlePosition3.width / 2);
  circleCenterY3 = circlePosition3.top + (circlePosition3.width / 2);

  // refresh values if window is resized
  console.log("window resized");
  return true
}

function moveEyes(evt) {
  resetTimer()
  if (evt.clientX + evt.clientY > 0) { //only if bigger than 0 (i.e. guarding NaN values)
    // Get the mouse location:
    var ratio = (circlePosition1.width / 2) / circle1.getAttribute("r")
    // Eye 1
    //calculate distance from mouse
    var dx1 = evt.clientX - circleCenterX1;
    var dy1 = evt.clientY - circleCenterY1;
    var dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    //ponderate
    if (dist1 / ratio > 3) {
      dx1 = dx1 * 3 / dist1;
      dy1 = dy1 * 3 / dist1;
    } else {
      dx1 = dx1 / ratio
      dy1 = dy1 / ratio
    }
    // Calculate the ratio between original SVG rayon & its actual diameter
    eye1.setAttribute("cx", 65.34 - dx1);
    eye1.setAttribute("cy", 20.845 + dy1);

    // Eye 2
    //calculate distance from mouse
    var dx2 = evt.clientX - circleCenterX2;
    var dy2 = evt.clientY - circleCenterY2;
    var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    //ponderate
    if (dist2 / ratio > 3) {
      dx2 = dx2 * 3 / dist2;
      dy2 = dy2 * 3 / dist2;
    } else {
      dx2 = dx2 / ratio
      dy2 = dy2 / ratio
    }
    // Calculate the ratio between original SVG rayon & its actual diameter
    eye2.setAttribute("cx", 52.329 - dx2);
    eye2.setAttribute("cy", 33.855 + dy2);

    // Eye 3
    //calculate distance from mouse
    var dx3 = evt.clientX - circleCenterX3;
    var dy3 = evt.clientY - circleCenterY3;
    var dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);
    //ponderate
    if (dist3 / ratio > 3) {
      dx3 = dx3 * 3 / dist3;
      dy3 = dy3 * 3 / dist3;
    } else {
      dx3 = dx3 / ratio
      dy3 = dy3 / ratio
    }
    // Calculate the ratio between original SVG rayon & its actual diameter
    eye3.setAttribute("cx", 78.352 - dx3);
    eye3.setAttribute("cy", 33.855 + dy3);

  }

}

function resetEyes() {
  // hard coded origins since SVG has its own matrix
  eye1.setAttribute("cx", 65.34);
  eye1.setAttribute("cy", 20.845);
  eye2.setAttribute("cx", 52.329);
  eye2.setAttribute("cy", 33.855);
  eye3.setAttribute("cx", 78.352);
  eye3.setAttribute("cy", 33.855);
};
