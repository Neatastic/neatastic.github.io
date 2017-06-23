---
layout: post
title:  "Make the SVG eyes follow the client mouse pointer"
tags:
  - Recipe
  - Vanilla JS
  - Algorithm
  - Website XP
sticky: false
comments: true
full: false
excerpt_separator: <!--more-->
published: false
---
{% include image.html type="left" image="/assets/images/yoda.jpg" post_url=page.url %}

This is the first post of a serie of 6. In this serie, I describe various techniques I used in the design of my [experimental website](http:///www.neatastic.com).

Today, I will explain how I made the eyes on the Neatastic logo.

After I worked for 3 hours on this [experimental website](http://www.neatastic.com){:target="_blank"}, I had more or less the same thing than what you see when you load the page.

It was [responsive](https://developer.mozilla.org/en-US/Apps/Progressive/Responsive) and pixel-perfect (no blur when you scale up) as it is now.

For my logo, I redesigned an icon with scaled proportions on the basis of a work from [Devid Saenz](https://thenounproject.com/deivid.saenz/).

But it was **all static**, no animation.

Also, the dot on the *i* of Neatastic was not an UFO but a regular dot, but we'll get to that [later](http://blog.neatastic.com).

I had an idea: "What if the three eyes of the logo were following the client mouse pointer?". <!--more-->

I stood for a minute, a little puzzled by that. I never have been a Math guy but I always had my ways with maths, most of the time with an intuitive approach.

In the end, I had 2 issues with coding this algorithm.

The first issue was to calculate the distance of the mouse with the center of the eyes, and report this on the available distance between the center of each eye and its outline.

I was not aware of the second issue yet. Guess what it is and you will get a cookie.

{% raw %}
<div class="ui divider"></div>
{% endraw %}


Let's start from the beginning. :steam_locomotive: *Whoo whoo*, here comes the train of thoughts:

  1 - I need to hook on the `mousemove` event as well as on his little brother `touchstart`. Let's attach it to `body`. Like this:

{% highlight html %}
<body ontouchstart="handleMouse();" onmousemove="handleMouse();">
{% endhighlight %}

  2 - I need to get the position of the eyes, can I query SVG Dom nodes? Well, as far as I can tell, it only worked with [inline svg](https://www.viget.com/articles/getting-started-with-inline-svg). I [asked the community](https://stackoverflow.com/questions/44314890/must-a-svg-be-inline-to-query-one-of-its-nodes-with-javascript) a few months later but it wasn't successful.

  3 - My SVG DOM node has two attributes 'Rx' and 'Ry'. I can animate these with javascript, in my `mousemove` event

  4 - Finally, the only thing I had not figured out was how to get the values to reposition the eyes relatively to the mouse

To get rid the the problem, I tried to deconstruct it.

First, I can get the position of the SVG node, and the position of the mouse client in my `mousemove` event. But how do I get the distance between them?

That where Pythagore helped.
I learned this 23 years ago & I was right to remember :
{% include image.html type="center" image="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Pythagorean_theorem_abc.svg/220px-Pythagorean_theorem_abc.svg.png" post_url=page.url %}

That would look like that in JavaScript:

{% highlight javascript %}
var circle = document.getElementById("circle");
var circlePosition = circle.getBoundingClientRect();

var circleCenterX = circlePosition.left +( circlePosition.width/2);
var circleCenterY = circlePosition.top +( circlePosition.width/2);

var dx=event.clientX-circleCenterX;
var dy=event.clientY-circleCenterY;
var distance = Math.sqrt(dx*dx + dy*dy);// the square & the root
{% endhighlight %}

Now I would normaly need the outline of the eye DOM object to go on.

But in my wise (re)design of the logo, I made sure that the distance between the center of the eye and it's outline stroke center was equal to the 1.5x the eye diameter. Also, the distance between the eye border and the nearest eye outline pixel is equal to the diameter of the eye. Yey!

So I didn't need the outline coordinates. I just needed to know that the max distance is 3. One less call to make *x* times per second.

It then first came out like this (**not a reusable code**):

{% highlight javascript %}
if (distance > 3) {
  dx = dx*3;
  dy = dy*3;
}
// else it stays the same as it is, since we are inside the eye.
{% endhighlight %}

Well, I was wrong.

It turns out, (as I didn't knew at the time) that SVG has its own coordinates matrix. Yup. It was my second issue.

So I had to calculate the ratio to convert that sweet distance into a value I could set to 'Rx' and 'Ry'.

No big deal, it's division. You need to calculate the ratio beetween regular pixels and the SVG unit.

{% highlight javascript %}
var ratio = (circlePosition.width/2) / circle.getAttribute("r")
{% endhighlight %}

Where `circlePosition.width/2` is the pixel value of the available distance and `circle.getAttribute("r")` is the SVG coordinate value of the available distance.

Once you have your ratio, you just need to update the above calculation with it:

{% highlight javascript %}
if (distance/ratio > 3) { // are we inside or outside the eye?
  dx = dx*3/distance;
  dy = dy*3/distance;
} else { // if we are inside the eye
  dx = dx/ratio
  dy = dy/ratio
}
{% endhighlight %}

Finally, I need to actually update the eye position with the values we just calculated.

To do so, I need to update the SVG circle 'Rx' and 'Ry' attributes.

SVG having its own matrix, the position values are hard coded, i.e. they work whatever the size of your SVG will be.

My ratio ensures me that if will also be correctly positionned, whatever the size of your SVG will be.

{% highlight javascript %}
eye.setAttribute( "cx", 65.34-dx);
eye.setAttribute( "cy", 20.845+dy);
{% endhighlight %}

And here we are. The full code ~~is~~ will be [available here](http://blog.neatastic.com) *(coming soon)*

As a final note, let's add a little sugar coating:

  * When the window is resized, you need to refresh the values of the above variables, i.e. :

  {% highlight javascript %}
  // refresh values if window is resized
  window.onresize = function(event) {
    circle = document.getElementById("eye");

    circlePosition = circle.getBoundingClientRect();

    circleCenterX = circlePosition.left + (circlePosition.width / 2);
    circleCenterY = circlePosition.top + (circlePosition.width / 2);
  }
  {% endhighlight %}

  * and if the user is idle for too long, you can reset the eyes positions to their original value.

That code is not inside the logo.js file since  I don't want to use an extra timer for that. Basically, after the user is idle for 5 seconds, I call the following function:

  {% highlight javascript %}
  function resetEyes() {
    eye.setAttribute("cx", 65.34);
    eye.setAttribute("cy", 20.845);  
  };
  {% endhighlight %}

  Cheers! :beer:
