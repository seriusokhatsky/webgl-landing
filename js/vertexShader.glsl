varying vec2 vUv;
uniform float u_time;
uniform float u_pos;
void main() {
    vUv = uv;
    vec3 newPositon = position;
    float wave = 30.;
    newPositon.z = position.z + sin( 180. +  ( position.y - u_pos ) / 160. ) * 2.2;
    gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPositon, 1.0);
}