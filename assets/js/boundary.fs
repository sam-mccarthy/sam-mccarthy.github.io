#version 300 es
precision mediump float;

vec4 boundary(vec2 coords, vec2 offset, float scale, sampler2D x){
    return scale * texture(x, coords + offset);
}