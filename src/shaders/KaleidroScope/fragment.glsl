uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;


#define PI 3.14159265


vec2 rotate(vec2 uv, float radians) {
	return vec2(uv.x * cos(radians) - uv.y * sin(radians),
	            uv.x * sin(radians) + uv.y * cos(radians));
}

float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float vignette(vec2 uv) {
    uv = (uv - 0.5) * 2.;
    uv *= 0.75;
    uv = uv / 2. + 0.5;
    return min(1., 40. * (uv.x * uv.y * (1. - uv.x) * (1. - uv.y) - pow(.2, 4.)));
}

vec2 kaleidoscope(vec2 uv, vec2 point) {
    for(int i = 0; i < 14; i++) {
        uv = rotate(uv, PI * 2. / 14.);
        uv.x = abs(uv.x);
    }
    uv -= point;
    return uv;
}

void main() {

    vec2 uv = vUv;
    float letterboxSize = mix(.333333, .1, (frame - 6719.) / (7816. - 6719.));
    if(uv.y < letterboxSize) {
        uv.y = -(uv.y - letterboxSize) * 3.5 + letterboxSize;
        uv.y += 0.005 * sin(uv.x * 4. + frame / 10.) + 0.008 * cos(uv.x * 11. + frame / 19.);
        uv.y += 0.005 * cos(sin(frame / 8. + 0.4 * sin(frame * 0.12 + uv.x)) + 1. + uv.x * 109. + frame / 9.);
    }

	uv = (uv - 0.5) * 2.0 * vec2(16., 9.) / 9.;
    uv *= mix(.1, 1.5, (frame - 6719.) / (7816. - 6719.));

	vec2 point = 0.5 * vec2(cos(frame / 100.), sin(frame / 100.)); 
	vec3 color = texture2D(tDiffuse, mod(kaleidoscope(uv, point) / 2. + 0.5, 1.)).rgb;
    color = pow(color, vec3(1.2));
    if(vUv.y < letterboxSize) {
        color *= vUv.y * vUv.y / letterboxSize / letterboxSize * 0.5;
        color += vec3(.2);
    }

    if(frame >= 7784.5) {
        color *= vec3(mix(1., 0., (frame - 7785.) / 14.));
    }

	gl_FragColor = vec4((rand(uv + frame / 5000.) - 0.5) * .05 + pow(color * vignette(vUv), vec3(2.2)), 1.);
}
