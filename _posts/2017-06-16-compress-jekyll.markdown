---
layout: post
title:  "Compress your Jekyll website without plugin"
tags:
 - Jekyll
 - Recipe
sticky: false
full: false
excerpt_separator: <!--more-->
comments: true
#published: false
---
I have written a few articles about Jekyll because I was using it for this blog.

However, this is not a blog about Jekyll. For the next posts, I will focus on the vanilla techniques I used in the design of my [experimental website](http://www.neatastic.com)

But before that, I want to draw your attention on [this marvelous piece of code](https://github.com/penibelst/jekyll-compress-html) allowing to seemlessly compress your Jekyll website without any plugin (i.e. Github-Pages compliant).

And this is a 2 minute job, for a very satisfying result. Whatever your Jekyll website is, I don't see a reason not to use it since it will drastically increase the speed of your website for almost no effort.

Here is how it goes.

First, you need to add a new layout to your application. [Download](https://github.com/penibelst/jekyll-compress-html/releases/latest) the latest version of <!--more-->the `compress.html` layout and unzip it into your `_layouts` folder.

Second, change your `default` layout with some frontmatter referencing the `compress` layout as parent one:

{% highlight html %}
{% raw %}

---
layout: compress
---

<html>
{{ content }}
</html>
{% endraw %}
{% endhighlight %}

Third, edit your `_config.yml` file and add the settings you want. Here is a sample that could fit into your needs, but take the time to read the [documentation](http://jch.penibelst.de/) to know what is what:

{% highlight yaml %}
{% raw %}
compress_html:
  clippings: all
  comments: ["<!-- ", " -->"]
  endings: all
  ignore:
    envs: [local]
  blanklines: false
  profile: true
  startings: [html, head, body]
  {% endraw %}
  {% endhighlight %}

  And finally, serve your Jekyll website and enjoy!

  If you like this feature, don't forget to star the [author github repo](https://github.com/penibelst/jekyll-compress-html).
