#version 460 es
precision mediump float;

in vec2 coords;
out vec4 result;

uniform float timestep;
uniform float rdx;
uniform sampler2D u;
uniform sampler2D x;

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

void main() {
    vec2 pos = coords - timestep * rdx * texture(u, coords).xy;
    result = f4texRECTbilerp(x, pos);
}