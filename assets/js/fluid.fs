precision mediump float;

uniform vec4 impulse;
uniform sampler2D u_pressure;
uniform sampler2D u_velocity;
uniform sampler2D u_ink;
uniform sampler2D u_vorticity;

void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}