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
    vec3 sunColor = vec3(1.0,1.0,0.7);
    float sunIntensity = 5.5;
    color += material * sunIntensity * sunColor * dot(sunDir,normal);

    //Sky light
    vec3 skyDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 skyColor = vec3(0.9,0.9,1.0);
    float skyIntensity = 3.5;
    color += material * skyIntensity * skyColor * dot(skyDir,normal);

    //Fake indirect sun light
    vec3 indSunDir = normalize(vec3(0.0, -1.0, 0.0));
    vec3 indSunColor = vec3(1.0,1.0,0.9);
    float indSunIntensity = 2.0;
    color += material * indSunIntensity * indSunColor * dot(indSunDir,normal);

    gl_FragColor = vec4(max(vec3(0.0), min(vec3(1.0), color)), 1.0);
}
