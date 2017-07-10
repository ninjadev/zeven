uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec3 originalColor = texture2D(tDiffuse, vUv).rgb;
    vec3 color = originalColor;
    float intensity = .2126 * color.r + .7152 * color.g + .0722 * color.b;
    vec3 blue = vec3(0.10196078431372549, 0.16470588235294117, 0.4235294117647059);
    vec3 red = vec3(0.6980392156862745, 0.12156862745098039, 0.12156862745098039);
    vec3 yellow = vec3(0.9921568627450981, 0.7333333333333333, 0.16862745098039217);
    if(intensity < 0.5) { 
        color = mix(blue, red, vec3(intensity * 2.));
    } else {
        color = mix(red, yellow, vec3((intensity - .5) * 2.));
    }
    gl_FragColor = vec4(color * 0.5 + originalColor * 0.5, 1.);
}
