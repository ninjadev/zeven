uniform float frame;
uniform sampler2D tDiffuse;
uniform vec2 translation;

varying vec2 vUv;

float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float vignette(vec2 uv) {
    return min(1., 6000. * (uv.x * uv.y * (1. - uv.x) * (1. - uv.y) - pow(.2, 4.)));
}

float verticalNoise(vec2 uv) {
    return rand(vec2(uv.x * 0.3242 + 1.4839, 1.));
}

float randomLines(vec2 uv, float a, float b, float c, float d) {
    float discrete = floor(frame / 4.);
    return step(0.0002 + 0.0005 * sin(discrete / a),
            abs(uv.x - b + 0.05 * sin(discrete / c) * cos(discrete / d)));
}

vec3 scene(vec2 uv) {
    vec3 color = texture2D(tDiffuse, uv).rgb;
    color += 0.1;
    color *= vignette(uv);
    color *= 0.9 + 0.1 * rand(uv);
    color *= 0.95 + 0.05 * verticalNoise(vUv + floor(frame / 4.));
    color = 0.5 * color + color * 0.5 * randomLines(uv, 28., 0.7, 33., 58.);
    color = color * 0.8 + color * 0.2 * randomLines(uv, 47., 0.78, 61., 27.);
    color = color * 0.7 + color * 0.3 * randomLines(uv, 31., 0.28, 79., 43.);
    color = pow(color, vec3(1.5));
    color *= 0.8 + 0.4 * rand(vec2(floor(frame / 4.), 0.2));
    return color;
}

void main() {
    vec2 uv = vUv;
    uv += translation;
    uv = vec2(uv.x, mod(uv.y, 1.));
    gl_FragColor = vec4(scene(uv), 1.);
}
