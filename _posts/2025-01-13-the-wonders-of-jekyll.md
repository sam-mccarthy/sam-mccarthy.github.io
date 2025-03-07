---
title:  "A welcome, and my discovery of Jekyll"
date:   2025-01-13 12:00:00 -0500

description: "A brief welcome to anyone visiting, a look at Jekyll, and an exercise in Javascript."
pin: true
---

# A welcome

Welcome to my website / blog! Although not technically my first post (I wrote the class reviews first), I'll be using this one as a welcome post. I'm Samuel McCarthy, currently a junior Computer Science major at the University of Maryland, Baltimore County. I've been thinking that I need a good spot to put my thoughts, and somewhere I can talk about my projects without clogging README files, so this seemed like a good place to do it.

# Github Pages

This website is hosted on Github Pages, since I find that it works incredibly well with Jekyll and is overall an enjoyable experience. I'm considering getting a domain to attach this website to, but for the meantime, we're sticking to the good ol' .github.io domain. I'll update this post whenever that happens.

# Jekyll

When I was setting up the site through Github Pages, I discovered Jekyll, and decided to look into it. After setting up the base repo, I was attracted to the idea of being able to generate a blog entirely from Markdown files and some configuration, and ended up really enjoying the setup process. The repo builds using Github Actions, and if you're interested, you can take a look at [the Github repository](https://github.com/sam-mccarthy/sam-mccarthy.github.io/).

It took me a little bit to find a nice theme, but I ended up deciding on the elegant [Klisé theme](https://github.com/piharpi/jekyll-klise), for its simplicity and beauty. There are a couple issues with it, from what I can tell - the footer is static, so you have to override the theme file for it, and the dark-mode button is broken if you don't set a default mode in `_config.yml`.

But, alas, that concludes this welcome of sorts. Always appreciate anyone taking a look at these posts! I'll be seeing what more can be done with Jekyll. The following is part of an in-progress experiment of mine - rendering things within a Jekyll post. I embedded a Javascript canvas, along with a couple script tags in this Markdown file, so I'm able to use WebGL to execute GLSL shaders. I have a fullscreen example of this, as well, using a custom post layout - which you can checkout.

You can hold shift to change the Julia constant, and you can pan and zoom with your mouse.

<canvas id="julia" style="width: 100%;"></canvas>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="{{ site.url }}/assets/js/julia.js"></script>