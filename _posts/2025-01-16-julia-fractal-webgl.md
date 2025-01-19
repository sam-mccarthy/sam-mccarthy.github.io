---
title:  "Rendering of the Julia Fractal in WebGL"
description: "Using script tags in a Jekyll .md file to render fractals using GLSL"
date:   2025-01-16 02:00:00 -0500
author: sam
pin: true
---

Mouse to pan and zoom, shift click to change Julia constant.
<canvas id="julia" style="width: 100%;"></canvas>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://{{ site.url }}/assets/js/julia.js"></script>