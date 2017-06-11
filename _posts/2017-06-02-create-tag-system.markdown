---
layout: post
title:  "Jekyll tags, the easy way :smile:"
tags:
  - Jekyll
sticky: false
comments: true
full: false
excerpt_separator: <!--more-->
---
Hello all,

{% include image.html type="right" image="/assets/images/tags.jpg" post_url=page.url %}
Here is a small post to explain how I made the tags system for this Jekyll powered blog.

Many others have done it and I guess this is no big deal, but here it is, with a touch of the Neatastic flavor.

As you may know, I use Semantic-ui as front-end for this blog. It provides [an handy tag element](https://semantic-ui.com/elements/label.html#tag) and several shortcut classes for colors.

So I decided to make a tag system for each post. At the time, I managed to make it on first try, just as I wanted it (:heart: Jekyll). So I didn't bother to check what others did.

It turns out, as you may expect, that they did things in a very similar way I did.

Here is the train of thoughts:

1 - I want an easy  <!--more-->and declarative way to declare the tags
2 - I want a fall back in case it isn't a registered tag
3 - I want an ability to click on a tag to display all the related posts, i.e. with the same tag.

### 1 - Declare the tags

Front matter, thank you. I didn't have to bother to change my ideal presentation:

{% raw %}
---
title: "how I always wanted to make a tag system"
*tags:
  - Jekyll
  - News*
---
{% endraw %}
