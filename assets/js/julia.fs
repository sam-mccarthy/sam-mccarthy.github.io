#version 300 es
precision highp float;

out vec4 result;

uniform vec2 resolution;
uniform vec2 pan;
uniform float zoom;

void main(){
    const float ESCAPE_RADIUS = 2.0;
    const float ESCAPE_RADIUS_2 = ESCAPE_RADIUS * ESCAPE_RADIUS;
    const float cx = -0.79;
    const float cy = 0.15;
    const int MAX_ITER = 100;

    float ratio = (resolution.y / resolution.x) * 2.0;
    int iteration = 0;
    float zx = (gl_FragCoord.x / resolution.x * 2.0 - 1.0) * ESCAPE_RADIUS;
    float zy = (gl_FragCoord.y / resolution.y * ratio - ratio / 2.0) * ESCAPE_RADIUS;

    float xtemp;
    while(zx * zx + zy * zy < ESCAPE_RADIUS_2 && iteration < MAX_ITER){
        xtemp = zx * zx - zy * zy;
        zy = 2.0 * zx * zy + cy;
        zx = xtemp + cx;

        iteration++;
    }

    result = vec4(float(iteration) / float(MAX_ITER), 0, 0, 1);
}