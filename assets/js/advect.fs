#version 300 es
precision mediump float;

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