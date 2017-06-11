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
    gl_FragColor = (abs(vNormal.z) > length(cliffSample) - 0.3)
        ? vec4(1.0,1.0,1.0,1.0) 
        :cliffSample;


    vec3 lightDir = normalize(vec3(1.0,0.0,1.0));
    gl_FragColor *= dot(lightDir, normalize(vNormal+cliffSample.xyz));
}
