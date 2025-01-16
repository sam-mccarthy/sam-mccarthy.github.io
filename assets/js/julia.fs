#version 300 es
precision mediump float;

out vec4 result;

uniform vec2 pan;
uniform float zoom;

void main(){
    result = vec4(1, 0, 0, 1);
}