varying vec2 vUv;
uniform float u_time;
uniform float u_pos;
uniform float u_hover;
void main() {
    vUv = uv;
    vec3 newPositon = position;
    float wave = 30.;
    float zOffset = sin( 180. +  ( position.y - u_pos ) / 160. + u_time / 10. ) * 2.0;
    newPositon.z = position.z + zOffset * ( 1. - u_hover );
    // newPositon.x += newPositon.x * (u_hover / 20.);
    // newPositon.y += newPositon.y * (u_hover / 20.);
    gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(newPositon, 1.0);
}