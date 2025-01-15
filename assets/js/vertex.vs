precision mediump float;

attribute vec2 a_position;
uniform vec2 u_resolution;

void main() {
    vec2 clip_space = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clip_space, 0.0, 1.0);
}