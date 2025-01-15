#version 460 es
precision mediump float;

in vec2 coords;
in vec2 offset;
out vec4 result;

uniform float scale;
uniform sampler2D x;

void main(){
    result = scale * texture(x, coords + offset);
}