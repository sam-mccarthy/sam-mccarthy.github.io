#version 300 es
precision mediump float;

vec4 gradient(vec2 coords, float halfrdx, sampler2D p, sampler2D w){
    float pL = texture(p, coords - vec2(1, 0)).x;
    float pR = texture(p, coords + vec2(1, 0)).x;
    float pB = texture(p, coords - vec2(0, 1)).x;
    float pT = texture(p, coords + vec2(0, 1)).x;

    return texture(w, coords) - halfrdx * vec4(0, 0, pR - pL, pT - pB);
}