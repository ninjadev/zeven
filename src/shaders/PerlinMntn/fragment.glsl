uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D tCliff;

varying vec3 vUv;
varying float vHeight;
varying vec3 vNormal;
varying vec3 vPos;

vec3 addFog( in vec3 color, in float distance
           , in vec3 sunDir, in vec3 rayDir, in vec3 camPos){

    rayDir = normalize(rayDir);
    sunDir = normalize(sunDir);
    float sunAmount = max( dot( rayDir, sunDir ), 0.0 );
    vec3  fogColor  = mix( vec3(0.5,0.6,0.7), // bluish
            vec3(1.0,0.9,0.7), // yellowish
            clamp(pow(sunAmount,8.0)*100., 0., 1.) );

/*   DEACTIVATED
    //Fancy fog model with "extinction" and "inscattering"
    vec3 be = 0.001 * vec3(1.0,1.0,1.0);
    vec3 bi = 0.001 * vec3(1.0,1.0,1.0);
    vec3 extColor = vec3( exp(-distance*be.x), exp(-distance*be.y), exp(-distance*be.z) );
    vec3 insColor = vec3( exp(-distance*bi.x), exp(-distance*bi.y), exp(-distance*bi.z) );
    color  = color*(1.0-extColor) + fogColor*insColor;
    TO HERE*/

    //Extra fog in valleys
    float c = 0.12;
    float b = 0.000005177;
    float fogAmount = c * exp(-camPos.y*b/1000.) * (1.0-exp( -distance*rayDir.y*b/100. ))/(b*rayDir.y);
    color = mix( color, fogColor, clamp(fogAmount, 0.0, 1.0));
    return color;
}

void main() {

    //vec3 bNormal = vNormal +  0.9 * texture2D(tCliff,vUv.xy * 7.0+vec2(0.5,0.5)).xyz;

    vec4 cliffSample = texture2D(tCliff,vUv.xy * 7.0);
    //z coordinate is height in model space
    vec3 material = (abs(vNormal.y) > length(cliffSample) - 0.3)
        ? 0.2 * vec3(1.0,1.0,1.0)
        : 0.2 * cliffSample.rgb * cliffSample.rgb ;


    vec3 color = vec3(0.0);

    // NOTE: Normals are calculated when the plane is sideways
    // So for lights z and y axes are swapped
    //vec3 normal =  normalize(vNormal+cliffSample.xyz);
    vec3 normal =  normalize(vNormal);


    //Sun light
    vec3 sunDir = normalize(vec3(5.0, 2.66, -5.0));
    //vec3 sunColor = vec3(1.64,1.27,0.99); //iq
    vec3 sunColor = 5.64 * vec3(1.0, 0.98823, 0.9058); //skymap data
    float sunIntensity = clamp( dot(sunDir, normal), 0.0, 1.0);

    //Sky light
    //vec3 skyColor = vec3(0.16,0.20,0.28); //iq
    vec3 skyColor = vec3(0.2109375, 0.236328125, 0.29296875); //skymap data
    float skyIntensity = clamp( 0.5 + 0.5 * normal.y, 0.0, 1.0);

    //Fake indirect sun light
    vec3 indSunDir = normalize(sunDir*vec3(-1.0,0.0,-1.0));
    vec3 indSunColor = vec3(0.40,0.28,0.20);
    float indSunIntensity = clamp( dot(indSunDir, normal), 0.0, 1.0);

    color +=  sunIntensity * sunColor;
    color +=  skyIntensity * skyColor;
    color +=  indSunIntensity * indSunColor;

    color *= material;


    //Fog
    float z = gl_FragCoord.z/gl_FragCoord.w;
    vec3 camRay =  vPos;
    color = addFog(color, z, sunDir, camRay, cameraPosition.xyz);

    color = pow(color, vec3(1.0/2.2));
    gl_FragColor = vec4(color, 1.0);
}


