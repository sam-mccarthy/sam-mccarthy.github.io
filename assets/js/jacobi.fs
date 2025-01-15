#version 460 es
precision mediump float;

in vec2 coords;
out vec4 result;

uniform float alpha;
uniform float rBeta;
uniform sampler2D x;
uniform sampler2D b;

void main(){
    vec4 xL = texture(x, coords - vec2(1, 0));
    vec4 xR = texture(x, coords + vec2(1, 0));
    vec4 xB = texture(x, coords - vec2(0, 1));
    vec4 xT = texture(x, coords + vec2(0, 1));
    vec4 bC = texture(x, coords);

    result = (xL + xR + xB + xT + alpha * bC) * rBeta;
}