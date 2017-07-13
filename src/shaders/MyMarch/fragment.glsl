uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const int MAX_MARCHING_STEPS = 255;
const float EPSILON = 0.0001;
const float END = 100.0;
const float START = 0.0;

float sphere(vec3 p, float s) {
    return length(p)-s;
}

float sdf(in vec3 p) {
    float sphere1 = sphere((p-1.0), 1.0);
    float sphere2 = sphere(p, 2.0*sin(frame/24.));
    return max(sphere1, -sphere2); 
}


float march(vec3 eye, vec3 dir, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sdf(eye + depth * dir);
        if (dist < EPSILON) {
            return depth;
        }
        depth+=dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}

vec3 rayDir(float fov, vec2 uv) {
    vec2 xy = uv * 2.0 - 1.0;
    xy.y = xy.y / (16.0 / 9.0);
    float z = 2.0 / tan(radians(fov / 2.0));
    return normalize(vec3(xy, -z));
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sdf(vec3(p.x + EPSILON, p.yz)) - sdf(vec3(p.x - EPSILON, p.yz)),
        sdf(vec3(p.x, p.y + EPSILON, p.z)) - sdf(vec3(p.x, p.y - EPSILON, p.z)),
        sdf(vec3(p.xy, p.z + EPSILON)) - sdf(vec3(p.xy, p.z - EPSILON))
    ));
}


vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                          vec3 lightPos, vec3 lightIntensity) {
    vec3 N = estimateNormal(p);
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));
    
    float dotLN = dot(L, N);
    float dotRV = dot(R, V);
    
    if (dotLN < 0.0) {
        // Light not visible from this point on the surface
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        // Light reflection in opposite direction as viewer, apply only diffuse
        // component
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    
    vec3 light1Pos = vec3(4.0 * sin(frame / 90.),
                          2.0,
                          4.0 * cos(frame / 90.));
    vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light1Pos,
                                  light1Intensity);
    
    vec3 light2Pos = vec3(2.0,
                          2.0,
                          2.0);
    vec3 light2Intensity = vec3(0.4, 0.4, 0.4);
    
    color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                  light2Pos,
                                  light2Intensity);    
    return color;
}


void main() {

    vec3 eye = vec3(0.0, 0.0, 19.0);
    vec3 dir = rayDir(60.0, vUv);
    
    float dist = march(eye, dir, START, END);


    if (dist >= END-EPSILON) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    vec3 p = eye + dir * dist;

    vec3 color = vec3(vUv.xy, 0.0);

    color = phongIllumination(color, color, vec3(1.0, 1.0, 1.0), 10.0, p, eye);


    gl_FragColor =vec4(color, 1.0);



}


