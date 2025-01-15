#version 460 es
precision mediump float;

in vec2 coords;
out vec4 result;

uniform float radius;
uniform float timestep;
uniform vec4 impulse;

void main(){
    vec4 F = vec4(impulse.zw, 0, 0);
    float dx = coords.x - impulse.x;
    float dy = coords.y - impulse.y;
    float dist = dx * dx + dy * dy;

    result = F * timestep * exp(dist / radius);
}