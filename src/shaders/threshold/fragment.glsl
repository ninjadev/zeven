uniform float frame;
uniform float threshold;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const vec2 right = vec2(1., 0.) / 128.;
const vec2 down = vec2(0., 1.) / 128.;

float horizontal(vec2 xy) {
    float valueLeft = step(texture2D(tDiffuse, xy - right).r, threshold);
    float valueTopLeft = step(texture2D(tDiffuse, xy - right - down).r, threshold);
    float valueBottomLeft = step(texture2D(tDiffuse, xy - right + down).r, threshold);
    float valueRight = step(texture2D(tDiffuse, xy + right).r, threshold);
    float valueTopRight = step(texture2D(tDiffuse, xy + right - down).r, threshold);
    float valueBottomRight = step(texture2D(tDiffuse, xy + right + down).r, threshold);
    return
        -valueLeft * 2.
        -valueTopLeft
        -valueBottomLeft
        +valueRight * 2.
        +valueTopRight
        +valueTopLeft;
}

float vertical(vec2 xy) {
    float valueTop = horizontal(vUv - down);
    float valueTopLeft = horizontal(vUv - down - right);
    float valueTopRight = horizontal(vUv - down + right);
    float valueBottom = horizontal(vUv + down);
    float valueBottomLeft = horizontal(vUv + down - right);
    float valueBottomRight = horizontal(vUv + down + right);
    return
        -valueTop * 2.
        -valueTopLeft
        -valueTopRight
        +valueBottom * 2.
        +valueBottomLeft
        +valueBottomRight;
}


void main() {
    float value = vertical(vUv);

    float lineWidth = 0.02;
    float innerColor = 1. - step(texture2D(tDiffuse, vUv).r, threshold);
    if(vUv.y > 1. - lineWidth ||
       vUv.y < lineWidth ||
       vUv.x > 1. - lineWidth ||
       vUv.x < lineWidth) {
        value = innerColor;
    }
    vec4 color = vec4(innerColor * 0.5 + value);

    color.a *= .5;
    gl_FragColor = color;
}
