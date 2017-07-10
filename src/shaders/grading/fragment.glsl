uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D lookup;

varying vec2 vUv;


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
    vec4 color = texture2D(tDiffuse, vUv);
    vec4 gradedColor = sampleAs3DTexture(lookup, color.rgb, 16.);
    gradedColor.a = color.a;
    gl_FragColor = vec4(gradedColor.rgb, 1.);
}
