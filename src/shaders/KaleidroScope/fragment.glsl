uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;


#define PI 3.14159265


vec2 rotate(vec2 uv, float radians) {
	return vec2(uv.x * cos(radians) - uv.y * sin(radians),
	            uv.x * sin(radians) + uv.y * cos(radians));
}


vec2 kaleidoscope(vec2 uv, vec2 point) {
    for(int i = 0; i < 12; i++) {
  		uv = rotate(uv, PI * 2. / 12.);
  		uv.x = abs(uv.x);
	}
	uv -= point;
	return uv;
}

void main() {
	vec2 uv = (vUv - 0.5) * 2.0 * vec2(16., 9.) / 9.;
	vec2 point = 0.5 * vec2(cos(frame / 100.), sin(frame / 100.)); 
	vec3 color = texture2D(tDiffuse, kaleidoscope(uv, point) / 2. + 0.5).rgb;
	gl_FragColor = vec4(color, 1.);
}