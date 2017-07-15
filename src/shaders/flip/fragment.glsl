uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 img = vec4(texture2D(tDiffuse, vec2(1. - vUv.x, vUv.y)).rgb, 0.);
    gl_FragColor = img;
}
