#version 460 es
precision mediump float;

in vec2 coords;
out vec4 result;

uniform float halfrdx;
uniform sampler2D w;

void main(){
    vec4 wL = texture(w, coords - vec2(1, 0));
    vec4 wR = texture(w, coords + vec2(1, 0));
    vec4 wB = texture(w, coords - vec2(0, 1));
    vec4 wT = texture(w, coords + vec2(0, 1));

    result = vec4(halfrdx * ((wR.x - wL.x) + (wT.y - wB.y)), 0.0, 0.0, 1.0);
}