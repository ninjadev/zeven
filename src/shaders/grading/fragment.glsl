uniform float frame;
uniform float gammaCorrection;
uniform sampler2D tDiffuse;
uniform sampler2D lookup;

varying vec2 vUv;

float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float vignette(vec2 uv) {
    uv = (uv - 0.5) * 2.;
    uv *= 0.75;
    uv = uv / 2. + 0.5;
    return min(1., 20. * (uv.x * uv.y * (1. - uv.x) * (1. - uv.y) - pow(.2, 4.)));
}

vec4 sampleAs3DTexture(sampler2D tex, vec3 uv, float width) {
    uv.y = 1. - uv.y;
    float sliceSize = 1.0 / width;
    float slicePixelSize = sliceSize / width;
    float sliceInnerSize = slicePixelSize * (width - 1.0);
    float zSlice0 = min(floor(uv.z * width), width - 1.0);
    float zSlice1 = min(zSlice0 + 1.0, width - 1.0);
    float xOffset = slicePixelSize * 0.5 + uv.x * sliceInnerSize;
    float s0 = xOffset + (zSlice0 * sliceSize);
    float s1 = xOffset + (zSlice1 * sliceSize);
    vec4 slice0Color = texture2D(tex, vec2(s0, uv.y));
    vec4 slice1Color = texture2D(tex, vec2(s1, uv.y));
    float zOffset = mod(uv.z * width, 1.0);
    vec4 result = mix(slice0Color, slice1Color, zOffset);
    return result;
}
 
void main() {
    vec4 originalColor = texture2D(tDiffuse, vUv);
    originalColor = mix(
        originalColor,
        vec4(pow(originalColor.rgb, vec3(1.0/2.2)), 1.),
        gammaCorrection); //Gamma correction!

    vec4 gradedColor = sampleAs3DTexture(lookup, originalColor.rgb, 16.);
    float noise = rand(vUv + vec2(frame / 100., 0.324324));
    vec3 color = gradedColor.rgb + (noise - 0.5) * 0.08;
    color *= vignette(vUv);
    color = min(vec3(1.), color);
    color = max(vec3(0.), color);
    gl_FragColor = vec4(color, 1.);
}
