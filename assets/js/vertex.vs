#version 300 es
precision highp float;

in vec2 position;
uniform vec2 resolution;

void main() {
    vec2 clip_space = (position / resolution) * 2.0 - 1.0;
    gl_Position = vec4(clip_space, 0.0, 1.0);
}