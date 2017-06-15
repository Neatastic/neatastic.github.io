---
layout: post
title:  "Jekyll tags, the easy way :smile:"
tags:
  - Jekyll
  - Recipe
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

1. I want an easy  <!--more-->and declarative way to declare the tags
2. I want a fall back in case it isn't a registered tag
3. I want an ability to click on a tag to display all the related posts, i.e. with the same tag.

### 1 - Declare the tags

Front matter, thank you. I didn't have to bother to change my ideal presentation. Here is a minimal version of it :

    ---
    title: "how I always wanted to make a tag system"
    tags:
      - Jekyll
      - News
    ---

It will create a `tags` variable, an array of strings, attached to my post.

### 2 - Displaying the tags and handling unregistered tags

I use an `include` component for that. It is very basic : I iterate on the `tags` array, and using the `case` operator, I print the correct HTML code.

However, for the `else` cases, I need to assign a new color and make sure that I will keep this color if that tag shows up again.

Yes, Jekyll is static. It can't write in a database the new tags. So how can I make sure that :

1. An unregistered tag will have the same color in all posts
2. It will keep the same color each time I update the blog

I do have weird ideas sometimes. And it was probably one of them.

I recalled that awesome gift that some people have called [Synesthesia](https://en.wikipedia.org/wiki/Synesthesia).

They can for example see numbers as colors. I want that too for my text.

So what if I make an algorithm to define a color for a word, based on the only thing I have, i.e. the characters of its string?

{% include image.html type="center" image="/assets/images/challenge_accepted.jpg" post_url=page.url %}

Ok, I know there are several levels of difficulty to tackle this. I will keep it simple.

Here is my train of thoughts

 * I need to attach a value to each letter. I will take the sum of this value, divide it by the number of letters, and depending on the result, pick the related color.

 * I want to be able to add new colors if needed, and not depend on the existing number of colors.

 * Wait, what if I get several times the same color? I will have to loop on the tags inside my included component and exclude already assigned colors? No, I will have to loop on every post and every tag to get sure that whatever the final set of tags will be, they will have the same colors and avoid duplicates.

 * How do I get an integer value from a character? Well, I could match it against an array, but it would be bothersome to write. I can take the hexadecimal value of each letter and keep only the number part. It should do.

 Once I got there, I knew how to code this feature. And here it is:
