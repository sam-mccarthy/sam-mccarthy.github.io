#version 300 es
precision highp float;

out vec4 result;

uniform vec2 cxy;
uniform vec2 resolution;
uniform vec2 pan;
uniform float zoom;

void main(){
    const float R = 2.0;
    const int MAX_ITER = 500;

    float x_ratio = 2.0 * R * zoom;
    float y_ratio = (resolution.y / resolution.x) * x_ratio;
    int iteration = 0;
    float zx = ((gl_FragCoord.x / resolution.x) * x_ratio - x_ratio / 2.0) + pan.x;
    float zy = ((gl_FragCoord.y / resolution.y) * y_ratio - y_ratio / 2.0) + pan.y;

    float xtemp;
    while(zx * zx + zy * zy < R * R && iteration < MAX_ITER){
        xtemp = zx * zx - zy * zy;
        zy = 2.0 * zx * zy + cxy.y;
        zx = xtemp + cxy.x;

        iteration++;
    }

    float color = float(iteration) / float(MAX_ITER);
    result = vec4(color, color, color, 1);
}