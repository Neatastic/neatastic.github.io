---
layout: post
title:  "Creating a sticky post feature for Jekyll"
date:   2017-05-31 14:32:39 +0200
tags:
 - Jekyll
 - Recipe
sticky: false
full: false
excerpt_separator: <!--more-->
comments: true
---
{% include image.html image="/assets/images/sticky.jpg" post_url=page.url %}
Here is a short explanation of how I made that sticky post feature. It was actually quite straightforward.

But let's start with a simple question: *What is a sticky post?*

*A sticky post is a post that stays on the top of the others. If there is more than one, only the latest is considered sticky.*

*It is useful to make an editorial post or to highlight a particular content.*

Here is how I made this feature.

First, you need to distinguish sticky posts from the others. For that, I added <!--more-->to the post [frontmatter](https://jekyllrb.com/docs/frontmatter/){:target="_blank"} a new argument `sticky=true` as shown on the last line of the sample below.


    ---
    layout: post
    title:  "All hot and sticky, these posts are like a summer day"
    date:   2017-05-31 14:32:39 +0200
    tags:
     - Jekyll
    sticky: true
    ---

Once you did update your first sticky post frontmatter, you need to actually display it.

I wanted the latest sticky post to actually be sticky, so, in my [layout file](https://github.com/Neatastic/neatastic.github.io/blob/master/index.html){:target="_blank"} where it should be displayed, I proceeded in 2 easy steps.

First, I assigned to a variable the list of all the `sticky` posts sorted by date :

{% raw  %}
    {% assign sortedPosts = site.posts | where: "sticky", "true" | sort:'date' %}
{% endraw %}

Second, I made an iteration on this variable, but I stopped after the first loop. Since my variable array is sorted by date, it will only display the latest sticky post:
{% raw  %}

    {% for post in sortedPosts limit:1  %}
    {% assign featuredPost = post.id %}
      {% include post.html featured=true %}
    {% endfor %}
{% endraw %}

Third, you might wonder why this line: {% raw  %}`{% assign featuredPost = post.id %}`{% endraw %}. Well, I like being concise and it seemed to be the easiest way to avoid displaying that latest sticky post again.

Since I have stored its `id` in the `featuredPost` variable, I can hide it in the main list of the posts like this:

{% raw  %}
    {% unless post.id == featuredPost %}
    {% include post.html %}
    {% endunless %}
{% endraw %}

Finally, I need to distinguish this post from the others. As you may have noticed, I passed a parameter to my include, {% raw  %}`{% include post.html featured=true %}`{% endraw %}.

Using this parameter, I will be able to display a specific user interface for sticky posts.

I used [semantic-ui](https://semantic-ui.com/){:target="_blank"} CSS library for this blog. It offers [a nice ribbon element](https://semantic-ui.com/elements/label.html#ribbon){:target="_blank"} that is perfectly suited to my needs. In order to emphasize it a little more, I created a class `featured` that will add a colored left border to my article.

And with a simple `if` statement in my `post` layout and include component, I'm all set :

{% raw  %}
    {% if include.featured %}
    <article class="ui segment featured">
    <div class="ui featured right ribbon label">Editorial</div>
    {% else %}
    <article class="ui segment">
    {% endif%}
{% endraw %}


And that's it! I hope it was helpful to you.

Feel free to comment, I love kind words but also improvements suggestions. :heart:
