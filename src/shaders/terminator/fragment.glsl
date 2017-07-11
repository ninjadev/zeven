uniform float frame;
uniform float amount;
uniform sampler2D tDiffuse;
uniform sampler2D overlay;

varying vec2 vUv;


#define PI 3.1415926535

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 fisheye(vec2 uv) {
  vec3 uvz = vec3(uv, 0.);
  float aperture = 178.0;
  float apertureHalf = 0.5 * aperture * (PI / 180.0);
  float maxFactor = sin(apertureHalf);
  
  vec2 xy = 2. * (uv - .5) * vec2(16., 9.) / 16. * 1.1;
  float d = length(xy);
  d = length(xy * maxFactor);
  float z = sqrt(1.0 - d * d);
  float r = atan(d, z) / PI;
  float phi = atan(xy.y, xy.x);
  uvz.x = r * cos(phi) + 0.5;
  uvz.y = r * sin(phi) + 0.5;
  if(d < 2. - maxFactor) {
    uvz.z = 1.;
  }
  return uvz;
}

float ramp(float y, float start, float end) {
    float inside = step(start,y) - step(end,y);
    float fact = (y-start)/(end-start)*inside;
    return (1.-fact) * inside;
}

float stripes(vec2 uv) {
    return ramp(mod(uv.y*2. + frame/ 60./ 60. * 105. / 2.,1.),0.1,0.9);
}

void main() {
    vec3 uvz = mix(vec3(vUv, 1.), fisheye(vUv), amount);
    vec3 color = texture2D(tDiffuse, uvz.xy).rgb;
    vec3 overlayColor = texture2D(overlay, uvz.xy).rgb;
    if(uvz.z < 0.5) {
        color = vec3(.0);
        overlayColor = vec3(0.);
    } else {
        color += 0.05 * stripes(uvz.xy) * amount;
    }
    color = mix(color, color * 0.95 + (rand(vUv + frame *0.0034) - .5) * 0.1, amount);
    color = mix(color, color + overlayColor, amount);
    color = mix(color, color * (0.7 + 0.3 * (1. + sin(uvz.y * PI * 2. * 576./ 2.)) * 0.5), amount);
    vec3 tint = vec3(.5, .6, 1.);
    color = mix(color, color * tint, amount);
    gl_FragColor = vec4(color, 1.);
}
