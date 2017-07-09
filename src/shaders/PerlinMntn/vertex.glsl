uniform sampler2D tDiffuse;

varying vec3 vUv;
varying float vHeight;
varying vec3 vNormal;

float perlin(vec2 pos) {
    return sin(pos.x*0.2) * sin(pos.y*0.2);
}

void main() {
    vUv.xy = uv;
    vec4 posWorld = modelMatrix * vec4(position, 1.0);
    vUv.z = (posWorld.y + 1000.0)/1500.0;
    vNormal = normal;
    gl_Position = projectionMatrix * viewMatrix * posWorld;
}
