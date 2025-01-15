#version 460 es
precision mediump float;

in vec2 coords;
out vec4 result;

uniform float halfrdx;
uniform sampler2D p;
uniform sampler2D w;

void main(){
    float pL = texture(p, coords - vec2(1, 0)).x;
    float pR = texture(p, coords + vec2(1, 0)).x;
    float pB = texture(p, coords - vec2(0, 1)).x;
    float pT = texture(p, coords + vec2(0, 1)).x;

    result = texture(w, coords) - halfrdx * vec4(0, 0, pR - pL, pT - pB);
}