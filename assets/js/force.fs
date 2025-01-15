#version 300 es
precision mediump float;

vec4 force(vec2 coords, vec4 impulse, float dt, float r){
    vec4 F = vec4(impulse.zw, 0, 0);
    float dx = coords.x - impulse.x;
    float dy = coords.y - impulse.y;
    float dist = dx * dx + dy * dy;

    return F * dt * exp(dist / r);
}