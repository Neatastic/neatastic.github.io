---
layout: post
title:  'Homemade JS animation "engine"? Challenge accepted!'
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

This is the second post of a serie of 6. In this serie, I describe various techniques I used in the design of my [experimental website](http:///www.neatastic.com).

In the [last post](/2017/06/19/mouse-following-eyes.html), I explained how I made the animation of the eyes following the mouse. Let's start from there.

Once I finished the eyes animation, I played with it for the rest of the day. I was enjoying having done that by myself.

The next day, I liked it even more (don't even ask how much I like it today :wink:).

I liked it so much that I came up with the following idea:

*"Let's detect when the user is idle, and then make something move on the screen with the eyes following it."*

My first idea was bugs. Like an annoying fruit fly buzzin all around the screen.

In my search for inspiration, I found [this](https://auz.github.io/Bug/). The final result is so good that it is confusing.<!--more--> Even more on a good screen.

Hats off to the author, I gave him a star and [you could too](https://github.com/Auz/Bug).

But it is creepy. :sweat_smile:

And then the theme stroke me: [`three eyed dude logo`](/2017/06/19/mouse-following-eyes.html) + "*we are so good that we are out of this world*" = **UFO**!

The dot on the *"i"* of the Neatastic text was a perfect place for my UFO. Beware, I wanted a quick win. But I never had it.

Be it for the struggle to design the UFO around the dot (infography newbie alert), or the initial UFO animation, it was a big slice in the "*one day in the life of a developer*" cake.

I found an excellent article explaining the basis of JavaScript animation. *I will update this with a link as soon as I find it back. It was a shady blog post like mine are, and definitely not in the Google top results.*

It helped me to create a first version of the ufo animation.

But if you know the website, note that it was a `random()` generated position within the screen available space. Not the actual animation I use.

Read the [other]() [posts]() if you want the full picture.

The Javascript animation is a useful (yet very demanding, I assume) feature you can add to your website. But be warned, you need to absolutely need it.

If not, go with pure CSS, it will run more smoothly.

It is an opinion built from experience but I might be wrong, you never know. [GreenSock](https://greensock.com/) and [Velocity](http://velocityjs.org/) are doing great as JavaScript animation ~~engines~~ frameworks.

Enough small talk, let's get to the point.

> How do you animate an UFO SVG so that it flies randomly all around the screen?

Well, you update its position CSS attributes.

The main idea is that you have an absolutely positionned element. You just change its `top` and `left` attributes.

Let's say you are in a position `[0,0]` on the `x` and `y` axes. You want to make a move to the position `[100,100]` in `100` milliseconds.

On each millisecond, you increment 1 on each of the position values.

But this is an easy case. Other things must be considered to make it complete.

First, I do start from my previous position. If, for instance, I go from right to left, I will need to soustract the step value instead of adding it.

Same thing for up and down.

Second, a plain linear animation will seem to be unnatural. So you need to add an easing function.

Finally, the size of the flying object has to be considered in the destination calculations : what if the UFO x position is equal to the screen width -1 px? I would not see my UFO. Yet, its coordinates would be in the screen.

I broke the animation feature into 3 functions:

  * `move` is the main function that handle the animation. It also provides the `step` function that will take care of the actual animation (i.e. updating the UFO position)

  * `_animate` will call the `step` function and keep track of the progress of the animation

  * `_makeEaseInOut` will take care of the easing

### The `move` function

{% highlight javascript %}
function move(element, delta, duration, to) {
  // element is the DOM node of the element that we will move
  // delta is a function that will alter the step value to create the easing feature. It stacks with the easeInOut function
  // duration is the duration of the animation
  // to (e.g. [250, 318] is the destination of the animation (random x & y within the screen coordinates) stored as a 2 items array
  _animate({
    delay: 30,
    duration: duration || 10000, // 1 sec by default
    delta: _makeEaseInOut(delta),
    to: to,
    step: function(delta) {
      // are we going to the left or to the right?
      if (ufoPreviousLocation[0] > to[0]) {
      //  from right to left, we decrement
        var leftPosition = ufoPreviousLocation[0] - ((ufoPreviousLocation[0] - to[0]) * delta)
      } else {
      // from left to right we increment
        var leftPosition = ufoPreviousLocation[0] + ((to[0] - ufoPreviousLocation[0]) * delta)
      }
      // same thing for top and bottom but written differently
      var topPosition = ufoPreviousLocation[1] > to[1] ? ufoPreviousLocation[1] - ((ufoPreviousLocation[1] - to[1]) * delta) : ufoPreviousLocation[1] + ((to[1] - ufoPreviousLocation[1]) * delta);
      // update of the UFO position
      element.style.left = leftPosition + "px"
      element.style.top = topPosition + "px"
    }
  })
}
{% endhighlight %}

A few things should be noted. `ufoPreviousLocation` is a 2 items array with the previous location of the UFO.

Since I move from one point to another, I have to keep track of where I previously was.

The delta is just a multiplier that will slightly change each step size based on the overall progress of the animation.

Now that we have the mechanism to create the animation, we need to loop over it and keep track of the progress.

This is where the `_animate` function comes in.

### The `_animate` function

{% highlight javascript %}
function _animate(opts) {


  // 'frames' is a global variable I used in this first version in order to be able to check from anywhere if there was an ongoing animation.
  frames = setInterval(function() { // at each loop (i.e. the delay value of the above function), we update the animation
  var start = new Date;
  var timePassed = new Date - start;
  var progress = timePassed / opts.duration;

  if (progress > 1) progress = 1
  // we get a delta value relatively to the overall progress
  var delta = opts.delta(progress);
  // just one line below but keep in mind that it is calling the 'step' function defined in the "move" function and provided to '_animate' as an argument
  opts.step(delta)
  // Now we just have to check if the animation if over.
  if (progress == 1) { // and if it is,
      // clean the timer
      clearInterval(frames);
      frames = false;

      // update the previous location
      ufoPreviousLocation = opts.to

      // clap in your hands
      console.log ("CLAP IN YOUR HANDS!!")
    }
  }, opts.delay || 10)

}
{% endhighlight %}

### The easing functions

I was delighted to realize how easy it is to make the animation more natural.

I insisted on that `delta` feature before but let's explain it one more time:

You take your animation progress (let's say from 1 to 100) and you modify the step value depending on it.

Here is a bunch of functions you can use (and a bunch of others [here](https://gist.github.com/gre/1650294))

{% highlight javascript %}
function _back(progress, x) {
  return Math.pow(progress, 2) * ((x + 1) * progress - x)
}

function _makeEaseInOut(delta) {
  return function(progress) {
    if (progress < .5)
    return delta(2 * progress) / 2
    else
    return (2 - delta(2 * (1 - progress))) / 2
  }
}

function _circ(progress) {
  return 1 - Math.sin(Math.acos(progress))
}

function _bounce(progress) {
  for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (progress >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2)
    }
  }
}
{% endhighlight %}

This maths are not intuitive at first sight (well, to me they aren't). But these are standard functions and I wasn't going to reinvent the wheel.

So I took them as they are.

One cool thing if you want to play it "Harry Potter" style is that you can stack them.

In my case, I stacked the `_back` and the `_makeEaseInOut` in order to get a feeling of inerty when the UFO start to move, an acceleration during the flight and a deceleration before the "landing".

It gave the animation a much more natural feeling.

{% raw %}
<div class="ui divider"></div>
{% endraw %}

And that's it! This is a very simple animation engine, but you can easily adapt it to whatever you need.

Also, feel free to comment and suggest improvements.
