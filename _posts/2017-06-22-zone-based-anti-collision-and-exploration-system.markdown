---
layout: post
title:  'Avoid collisions using a zone based exploration algorithm'
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
{% include image.html type="right" image="/assets/images/zones.png" caption="the desktop zones" post_url=page.url %}

{% assign dropdown-items = "Make the SVG eyes follow the client mouse pointer°/2017/06/19/mouse-following-eyes.html|Homemade JS animation engine? Challenge accepted!°/2017/06/22/homemade-javascript-animation-engine.html|Avoid collisions using a zone based exploration algorithm°/2017/06/22/zone-based-anti-collision-and-exploration-system.html°active|How I made a Javascript dialog engine°/2017/06/22/dialog-engine.html" | split : "|" %}

This is the third post of {% include dropdown.html anchor="a serie of 8" items=dropdown-items %}. In this serie, I describe various techniques I used in the design of my [experimental website](http:///www.neatastic.com).

In the [last post](/2017/06/19/homemade-javascript-animation-engine.html), I explained how I made the first set of functions for the UFO animations.

Shortly after I finished my little animation of the UFO, my girlfriend came back home.

All proud of my pointless effect, I showed it to her with all the emergency it requires. She smiled at the 1 or 2 first lucky jumps. But at the third jump, she looked at me and said:

> Meh, it flies over the other graphics in the page...

Huuum... Can I fix that?

Whoo whoo :steam_locomotive:, train of thoughts time :

  * How the fak will I do that? (2mn long, *"like a chicken who found a knife"*, as we say in French)

  * I could test collisions on each animation loop. No, that would be terrible in terms of performance

  * I will make sure that the jump destination is not on a another page element. I will just check if the UFO DOM node overlaps with something.

*15mn, a coffee and a few lines of code later ...*<!--more-->

  * Okay. I got two issues. First, it still goes over thelogo text and stuff because I check only the destination, not the path. Second, some of the jumps are way too big.

  * It would be nice to make the UFO explore the page. Should I create zones to explore and track what has been visited?

  * Oh! These zones could help me to figure out a way to avoid collisions?

  * Damn, each version of the layout will need its own zone map. I use only 2 versions: desktop & mobile. It should be ok.

  {% include image.html type="left" image="/assets/images/zones-mobile.png" caption="the mobile zones" post_url=page.url %}
I decided to give a try to this zone based approach, why should it take long?

I had considered other options like using a neural network with [TensorFlow](https://www.tensorflow.org/) (overkill, costly and possibly a pain to make for a noob like me).

Also, {% include altion.html  type="image" image="/assets/images/duh.jpeg" anchor="I love working with arrays" %}, and I wanted a 2 dimensionnal array to store the zones data.

You can't exactly do that in Javascript, but you can create nested arrays, and that's about the same.

As the fool I am, I drew on a post-it a basic zone distribution and started writing the zones properties values. I regretted that later.

The idea was that you can only go between zones where the collision was impossible.

I ended up with a bunch of json-like zone objects like this one:

{% highlight javascript %}
[ // ROW 1
  { // 0-0 is the zone name since I query it with `zoneMap[0][0]` /!\ good to know for the rest of this post
    x: 50,                         // x value
    y: 50,                         // y value
    h: Math.floor(logo.top) - 50,  // height
    w: Math.floor(logo.left) - 50, // width
    n: [[0, 1], [1, 0], [2, 0]]    // neighbors zones i.e. where you can jump from here
  },
{% endhighlight %}

And that's all I need.

Well, that and a little bit of JavaScript too :smile:.

On the bright side, you can't have collisions *by design*. One less thing to take care off.

From there, I just needed to use my [previous post](/2017/06/19/homemade-javascript-animation-engine.html) animations but with an additional level : the zone.

You randomize the UFO position within a zone you selected instead of the screen.

And the zone you picked is previously selected on a visited zones record basis.

Here is the code rationale:

  * Let's remove the zones too small for us to go in
  {% highlight javascript %}
  _canGoThere: function (testedZone)
  {
    var position = this.position() // this.position() includes width and height of the UFO
    return (testedZone.h > position.height && testedZone.w > position.width)
  },
  _nextDestination: function ()
  {
    var that = this // 'for' loops ahead
    var currentZone = screenMap[that.zone[0]][that.zone[1]];
    // select the neighbor zones actually big enough to contain the UFO
    var candidateZones = [];
    for (var i = 0; i < currentZone.n.length; i++)
    {
      var zoneTested = screenMap[(currentZone.n[i])[0]][(currentZone.n[i])[1]];
      if (that._canGoThere(zoneTested))
      {
        candidateZones.push([currentZone.n[i][0], currentZone.n[i][1]])
      }
    }
  {% endhighlight %}

  * Remove the previous zone if we can

  {% highlight javascript %}
      if (candidateZones.length > 2)
      {
        var index = contains(candidateZones, previousZoneCoordinates);
        candidateZones.slice(index, 1)
      }
  {% endhighlight %}

  * If we have only one unvisited zone, we pick it

  * If we have only visited zones but more than one, we pick the one where we don't come from

  * If we have only the one we come from, we go back

  * If we have no zone available (the user resized his/her window), well, [we might have killed the UFO]()!

  {% highlight javascript %}
  // if we still have more than 1 choices
    if (candidateZones.length > 1)
    {
      // first, shuffle the array with the Fisher-Yates method
      candidateZones = shuffle(candidateZones);
      //favor the zones where we never went
      for (var i = 0; i < candidateZones.length; i++)
      {
        if (contains(that.visited, candidateZones[i]) === -1)// `contains` is an homemade function
        {
          var nextZoneCoordinates = candidateZones[i];
          that.visited.push(nextZoneCoordinates)
          break;
        }
      }
      if (!nextZoneCoordinates)
      {
        // else we pick randomly one of the candidate neightbors of the current zone,
        var nextZoneCoordinates = candidateZones[Math.floor(Math.random() * candidateZones.length)];
      }
    }
    else
    {
      // check we aren't stuck
      if (!candidateZones || candidateZones.length < 1)
      {
        console.log("we are stuck!!!!!!");
        var nextZoneCoordinates = that.zone;
      }
      else
      {
        var nextZoneCoordinates = candidateZones[0];
      }
    }

  {% endhighlight %}

I added one necessary adjustment. In the function responsible for giving the coordinates within the zone, if the position is too close from a zone limit, I correct the value before applying it.

Same deal than for the edges of the window in [the first version](/2017/06/22/homemade-javascript-animation-engine.html).

{% highlight javascript %}
// adjust to make sure the ufo doesn't end up partially outside of the zone. 'this' being the UFO object

if (newX - testedZone.x < this.position().height / 2) newX = testedZone.x + this.position().height / 2 // too much on the left

if (newY - testedZone.y < this.position().width / 2) newY = testedZone.y + this.position().width / 2 // too much on the top

if ((testedZone.x + zoneWidth) - newX > this.position().height / 2) newX = (testedZone.x + zoneWidth) - this.position().height / 2 // too much on the right

if ((testedZone.y + zoneHeight) - newY > this.position().width / 2) newY = (testedZone.y + zoneHeight) - this.position().width / 2 // too much on the bottom
{% endhighlight %}


And that's it! The whole code for the UFO class is [here]().

Oh, one last thing. I lost my zone map post-it the next day. And I created a real debug function to display the zones only on the latest stages of developement of this project.

That was a bad idea. I should have (so should you) make a visual feedback ealier. I makes things much easier, and I assume I lost a lot of time because of that.

If you want to see the zones [in live](http://www.neatastic.com), you should check the [Neatastic Console Show]().

Cheers! :beer:

With :heart:,

Antoine
