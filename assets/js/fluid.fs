precision mediump float;

uniform vec4 u_impulse;
uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
uniform sampler2D u_ink;
uniform sampler2D u_vorticity;

uniform vec2 u_resolution;

void main() {
    vec2 uv = vec2(gl_FragCoord) / u_resolution;
    gl_FragColor = vec4(u_impulse.x, u_impulse.y, 0, 1);
}