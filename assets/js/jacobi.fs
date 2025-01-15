#version 300 es
precision mediump float;

vec4 jacobi(vec2 coords, float alpha, float rBeta, sampler2D x, sampler2D b){
    vec4 xL = texture(x, coords - vec2(1, 0));
    vec4 xR = texture(x, coords + vec2(1, 0));
    vec4 xB = texture(x, coords - vec2(0, 1));
    vec4 xT = texture(x, coords + vec2(0, 1));
    vec4 bC = texture(x, coords);

    return (xL + xR + xB + xT + alpha * bC) * rBeta;
}