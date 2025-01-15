#version 300 es
precision mediump float;

vec4 divergence(vec2 coords, float halfrdx, sampler2D w){
    vec4 wL = texture(w, coords - vec2(1, 0));
    vec4 wR = texture(w, coords + vec2(1, 0));
    vec4 wB = texture(w, coords - vec2(0, 1));
    vec4 wT = texture(w, coords + vec2(0, 1));

    return vec4(halfrdx * ((wR.x - wL.x) + (wT.y - wB.y)), 0.0, 0.0, 1.0);
}