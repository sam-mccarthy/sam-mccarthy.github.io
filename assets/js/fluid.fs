#version 300 es
precision mediump float;

uniform vec4 u_impulse;
uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
uniform sampler2D u_ink;
uniform sampler2D u_vorticity;

uniform vec2 u_resolution;

vec4 f4texRECTbilerp(sampler2D tex, vec2 uv) {
    vec2 weight = fract(uv);
    vec4 bottom = mix(texture(tex, uv), 
                        texture(tex, uv + vec2(1, 0)), 
                        weight.x);
    vec4 top = mix(texture(tex, uv + vec2(0, 1)), 
                    texture(tex, uv + vec2(1, 1)), 
                    weight.x);
    
    return mix(bottom, top, weight.y);
}

vec4 advect(vec2 coords, float timestep, float rdx, sampler2D u, sampler2D x) {
    vec2 pos = coords - timestep * rdx * texture(u, coords).xy;
    return f4texRECTbilerp(x, pos);
}

vec4 jacobi(vec2 coords, float alpha, float rBeta, sampler2D x, sampler2D b){
    vec4 xL = texture(x, coords - vec2(1, 0));
    vec4 xR = texture(x, coords + vec2(1, 0));
    vec4 xB = texture(x, coords - vec2(0, 1));
    vec4 xT = texture(x, coords + vec2(0, 1));
    vec4 bC = texture(x, coords);

    return (xL + xR + xB + xT + alpha * bC) * rBeta;
}

vec4 divergence(vec2 coords, float halfrdx, sampler2D w){
    vec4 wL = texture(w, coords - vec2(1, 0));
    vec4 wR = texture(w, coords + vec2(1, 0));
    vec4 wB = texture(w, coords - vec2(0, 1));
    vec4 wT = texture(w, coords + vec2(0, 1));

    return vec4(halfrdx * ((wR.x - wL.x) + (wT.y - wB.y)), 0.0, 0.0, 1.0);
}

vec4 gradient(vec2 coords, float halfrdx, sampler2D p, sampler2D w){
    float pL = texture(p, coords - vec2(1, 0)).x;
    float pR = texture(p, coords + vec2(1, 0)).x;
    float pB = texture(p, coords - vec2(0, 1)).x;
    float pT = texture(p, coords + vec2(0, 1)).x;

    return texture(w, coords) - halfrdx * vec4(0, 0, pR - pL, pT - pB);
}

vec4 boundary(vec2 coords, vec2 offset, float scale, sampler2D x){
    return scale * texture(x, coords + offset);
}

void main() {
    vec2 uv = vec2(gl_FragCoord) / u_resolution;

}