---
layout: post
title:  'How I made a Javascript dialog engine'
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
{% include image.html type="right" image="/assets/images/dialog.png" post_url=page.url %}

This is the fourth post of a serie of 7. In this serie, I describe various techniques I used in the design of my [experimental website](http:///www.neatastic.com).

The day after I coded my [zone based navigation system], I launched the website and had a big "{% include altion.html type="video" video="/assets/images/so_what.mp4" anchor="so what? moment" %}""

I mean, I have a little UFO flying all over the place. And the logo eyes follow it. The feeling of uselessnessof the whole thing was overhelming.

It was a concept I had to develop. I wanted to improve the use experience and see it through.

I watched the UFO fly a few minutes and started to imagine what could happen in there.

And I had a lot of fun dialogs in mind. Besides, it is an excellent way to introduce content while preserving the neat looks of the page.

In many ways, I'm lazy. I confess. And it was a lazy day. So I asked on Stack Overflow [how I could make a dialog feature](https://stackoverflow.com/questions/41595883/how-should-i-animate-2-bubbles-apparitions-and-content-to-display-a-dialog) :hankey:

Of course, and hopefully, no one gave me the fish. So I decided to think a bit and came up with something. :fishing_pole_and_fish:

It is a Javascript based approach because I wanted the flexibility of JSON-like objects and the power of Javascript to attach actions to replicas.

I wanted to scenarize the user experience. And [the final concept of this website]( ) was born.

Here is the storyboard<!--more-->:

- An alien couple live in the UFO

- They want to fly all over the place, but this annoying human is here.

- On first user activity, an "opening" dialog starts. It looks like that :

{% highlight javascript %}
opening : [{
  left: true,
  from: 0,
  to: 2,
  text: "Hey Honey!",
  action: {
    at: 0,
    do: function() {
    }
  }
},
{
  left: true,
  from: 2,
  text: "A human is here!",
  action: {
    at: 3,
    do: function() {
    }
  }
},
{
  left: false,
  from: 5,
  text: "Oh!"
},
{
  left: false,
  from: 6,
  text: "Did it see us?"
},
{
  left: true,
  from: 9,
  text: "No idea",
  to:12
}
],
{% endhighlight %}

- If you stay on the page, they get annoyed by your presence. This is the `waiting` dialogues category

- If you click on the UFO, they laught at you. This is the `clickedSafe` category

- If you are idle for a short time, they decide to take off. This is the `takeOff` category

- Inbetween jumps, they might decide to chat about random things. This is the `idle` category

I needed to be sure that there was enough room for the chat bubbles. So I created a collision box that you can display on [the website itself](http://www.neatastic.com). You should check the [Neatastic Console Show]( ) for further explanations.

- If you move your mouse while they are flying, they interrupt what they did and a dialog from the `spotted` category takes place while the ufo goes straight home.

Since it was against my "no collision" policy, I had to design [an algorithm to take them home using the zone system]( ), but this is another post matter.

- If you manage to click on the ufo before it reaches home, you damage it. This is something I also explain in [another post]( ). Depending on the level of damages, the triggered dialog will belong either to the `clickedHot`, `clickedDanger`, `clickedToDeath` categories.

And that's it.

Now let's have a quick look at the dialogue engine.

First, I wanted various JavaScript structures. Since I designed the UFO as a class, I would make an object. No real intent behind this besides the diversity.

Here is the full object without the dialogues:

{% highlight javascript %}
var dialogEngine = {

  // properties

  isActive: false,
  currentDialogTimer: false,
  currentDialog: false,
  leftBubble : document.getElementById("bubble-left"),
  rightBubble : document.getElementById("bubble-right"),
  leftBubbleContent : document.getElementById("bubble-left-text"),
  rightBubbleContent : document.getElementById("bubble-right-text"),


  // public methods

  // start dialog will increment the related counter and execute the display/hide & functions related to the bubbles
  start: function (dialogId) {
    // a special variable holds the current dialog number within its category
    var currentCount = this[dialogId + "Count"];

   // special case for opening since there is only one chat
    if (dialogId === "opening") {
      this.currentDialog = this[dialogId];
    } else {
      // we select the good dialog relatively to the current count
      this.currentDialog = this[dialogId][currentCount];
    }
    // get the last replica timing
    var curtains = this.currentDialog[this.currentDialog.length - 1].to;

    // in the order if we haven't heard all the dialogues on the category
    if (currentCount < this[dialogId].length - 1) {
      // if not increment +1 so that next time, we use the next dialogue
      this[dialogId + "Count"] =  currentCount + 1;
    } else { // else, shuffle the array and reset the count
      this.currentDialog= shuffle(this.currentDialog)
      this[dialogId + "Count"] = 0;
    }
    var that = this // for loop ahead
    var time = 0;
    // we start interpreting
    this.currentDialogTimer = setInterval(function() {
      for (var i = 0; i < that.currentDialog.length; i++) {

        //let's start with what should be displayed
        if ( that.currentDialog[i].from === time) {
          that.currentDialog[i].left?that._hideRight():that._hideLeft();
          that.currentDialog[i].left?that._showLeft(that.currentDialog[i].text):that._showRight(that.currentDialog[i].text);
        } // or hide
        if (that.currentDialog[i].to ===   time) {
          that.currentDialog[i].left?that._hideLeft():that._hideRight();
        }
        // and finish with what we should do
        if ( that.currentDialog[i].action &&  that.currentDialog[i].action.at === time) {
          that.currentDialog[i].action.do();
        }
      }
      // if we are at the last item
      if (time === curtains) {
        that._hideLeft();
        that._hideRight();
        that.stop();
      }
      time =   time + 0.5;
    }, 500)
  },

  stop: function () {
    // reset the dialog timer
    this.currentDialogTimer = false;
    this.currentDialog = false;
    clearInterval(this.currentDialogTimer);
    // switch the ufo state to its next one
    switch (ufo.state) {
      case "chatting": // we resume flying
      ufo.state = "flying";
      ufo.moveTo(ufo._nextDestination(),2000);
      break;
      case "opening":// opening over, we switch to landed
      ufo.state = "landed";
      resetTimer()
      break;
      case "waiting": // user is active, they are complaining
      ufo.state = "landed";
      pristineSky = 0;
      resetTimer()
      break;
      case "taking-off": // in this case, the change of state is taken care of at the end of the animation
      break;
      default:
      resetTimer();
    }
  },

  // private methods
  _showLeft: function (text) {
    this.leftBubbleContent.innerHTML = text||"";
    this.leftBubble.className = "bubble bubble-left shown";
  },
  _showRight: function (text) {
    this.rightBubbleContent.innerHTML = text||"";
    this.rightBubble.className = "bubble bubble-right shown";
  },
  _hideLeft: function () {
    this.leftBubble.className = "bubble bubble-left";
  },
  _hideRight: function () {
    this.rightBubble.className = "bubble bubble-right";
  }, //...
{% endhighlight %}

Once I had this, I just needed to attach an instance of my object to my UFO class :

{% highlight javascript %}
  dialog: Object.create(dialogEngine),
{% endhighlight %}

In order to be able to do this
{% highlight javascript %}
  ufo.dialog.start("opening");
{% endhighlight %}

Pretty straightforward.

That's it for this post. Cheers! :beer:

With :heart:,

Antoine
