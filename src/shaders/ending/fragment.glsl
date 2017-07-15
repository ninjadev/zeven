uniform sampler2D tDiffuse;
uniform float timer;

varying vec2 vUv;

void main() {
    float c = .5-((16./9.)*(1.-timer)/2.);
    float h = c + 0.1;

    vec4 img = vec4(0.0, 0.0, 0.0, 1.0);

    if(vUv.y > h && vUv.y <= 1.-h) {
        img = texture2D(tDiffuse, vUv);
    }

    if(h > .55) {
        if(vUv.y > (h-.30) && vUv.y <= (1.-(h-.30))) {
            img = vec4(1.0, 1.0, 1.0, 1.0);
        } else {
            img = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }

    gl_FragColor = img;
}
