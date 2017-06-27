uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

    vec4 background = texture2D(tDiffuse, vUv);

    vec4 farRight = texture2D(tDiffuse, vUv + vec2(.02, 0.));
    vec4 right = texture2D(tDiffuse, vUv + vec2(.005, 0.));
    vec4 left = texture2D(tDiffuse, vUv - vec2(.005, 0.));

    vec3 color = background.rgb;

    if(farRight.b > 0.5 && background.b < 0.5) {
        color *= 0.8;
    }

    if(right.b > 0.5 && background.b < 0.5) {
        color = 0.2 * vec3(.43, 0.3, 0.);
    }

    if(left.b > 0.5 && background.b < 0.5) {
        color = 0.2 * vec3(.43, 0.3, 0.);
    }

    gl_FragColor = vec4(color, 1.);
}
