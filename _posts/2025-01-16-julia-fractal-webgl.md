---
title:  "Rendering the Julia fractal using WebGL within Jekyll"
date:   2025-01-16 12:00:00 -0500

description: "Placing script tags within Jekyll posts makes for a fun exercise."
pin: true
---

Mouse to pan and zoom, shift click to change Julia constant.
<canvas id="julia" style="width: 100%;"></canvas>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="{{ site.url }}/assets/js/julia.js"></script>