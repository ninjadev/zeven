uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D tCliff;

varying vec3 vUv;
varying float vHeight;
varying vec3 vNormal;

void main() {

    //vec3 bNormal = vNormal +  0.9 * texture2D(tCliff,vUv.xy * 7.0+vec2(0.5,0.5)).xyz;

    vec4 cliffSample = texture2D(tCliff,vUv.xy * 7.0);
    //z coordinate is height in model space
    vec3 material = (abs(vNormal.z) > length(cliffSample) - 0.3)
        ? 0.2 * vec3(1.0,1.0,1.0)
        : 0.2 * cliffSample.rgb * cliffSample.rgb ;


    vec3 color = vec3(0.0);

    // NOTE: Normals are calculated when the plane is sideways
    // So for lights z and y axes are swapped
    vec3 normal =  normalize(vNormal+cliffSample.xyz);


    //Sun light
    vec3 sunDir = normalize(vec3(0.0, 1.0, 0.0));
    vec3 sunColor = vec3(1.64,1.27,0.99);
    float sunIntensity = clamp( dot(sunDir, normal), 0.0, 1.0);

    //Sky light
    vec3 skyDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 skyColor = vec3(0.16,0.20,0.28);
    float skyIntensity = clamp( dot(skyDir, normal), 0.0, 1.0);

    //Fake indirect sun light
    vec3 indSunDir = normalize(vec3(0.0, -1.0, 0.0));
    vec3 indSunColor = vec3(0.40,0.28,0.20);
    float indSunIntensity = clamp( dot(indSunDir, normal), 0.0, 1.0);

    color +=  sunIntensity * sunColor;
    color +=  skyIntensity * skyColor;
    color +=  indSunIntensity * indSunColor;

    color *= material;


    //Fog
    float z = gl_FragCoord.z / gl_FragCoord.w;
    vec3 fogColor = vec3(0.5,0.6,0.7);
    float fogAmount =  1. - exp(-z*0.0007);

    color = mix(color, fogColor, fogAmount);

    //color = pow(color, vec3(1.0/2.2));
    gl_FragColor = vec4(color, 1.0);
}
