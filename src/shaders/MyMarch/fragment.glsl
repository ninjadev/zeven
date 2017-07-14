uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const int MAX_MARCHING_STEPS = 64;
const float EPSILON = 0.001;
const float END = 1000.0;
const float START = 0.0;
const vec3 REP = vec3(4.0, 4.0, 6.0);

float uni(float d1, float d2) {
    return min(d1, d2);
}

float sub(float d1, float d2) {
    return max(-d1, d2);
}

float inter(float d1, float d2) {
    return max(d1, d2);
}

float displace(vec3 p, float d1) {
    float d2 = 0.07* sin(20.0*p.x)*sin(20.0*p.y)*sin(20.0*p.z);
    return d1+d2;
}

float box(vec3 p, vec3 b, float r) {
    return length(max(abs(p)-b, 0.0)) - r;
}

float sphere(vec3 p, float s) {
    return length(p)-s;
}

float repBox(vec3 p, vec3 c) {
    vec3 q = mod(p, c)-0.5*c;
    vec3 boxCoord = floor(p / REP);
    float box = box(q, vec3(0.4, 0.2, 0.5) * mod(frame/20.0 + boxCoord.z/10.0, 1.0), 0.3);
    return displace(p, box);
}

float sdf(in vec3 p) {
    //float sphere1 = sphere((p-vec3(2.0, -1., -50.)), 1.0);
    //float sphere2 = sphere(p, 2.0*sin(frame/24.));
    //float sphere2 = sphere(p, 2.0);
    //float box = box((p-vec3(0.0, -12.6, 0.0)), vec3(10000., 10., 10000.), 0.3);
    //return uni(sphere1, box);
    float repBox1 = repBox(p, REP);
    return repBox1;
}

float softShadow(in vec3 p, in vec3 lightDir, float mint, float maxt, float k) {
    float res = 1.0;
    float t = EPSILON;

    for(int i = 0; i < MAX_MARCHING_STEPS; i++){

        if(t > END){
            return 1.0;
        }
    
        float h = sdf(p + lightDir*t);
        if (h < EPSILON) {
            return 0.0;
        }
        res = min(res, k*h/t);
        t += h;
    }
    return res;
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
        return vec3(0.0, 0.0, 0.0);
    } 
    
    if (dotRV < 0.0) {
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;
    
    //vec3 light1Pos = vec3(4.0 * sin(frame / 90.), 2.0, 4.0 * cos(frame / 90.));
    //vec3 light1Pos = vec3(0.0, 9.0, -50.0 + 9.0 * cos(frame / 90.));
    vec3 light1Pos = vec3(0.0, 1.0*frame/100.0, 30.0*frame/2000.0);
    vec3 light1Intensity = vec3(0.4, 0.4, 0.4);
    
    vec3 phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light1Pos, light1Intensity);
    //float shadow = softShadow(p, light1Pos - p, START, END, 8.);
    //color = mix(vec3(1.0, 0.0, 0.0), color + phongContrib, shadow);
    color += phongContrib;
    
    vec3 light2Pos = vec3(2.0, 2.0, 2.0);
    vec3 light2Intensity = vec3(0.4, 0.4, 0.4);
    
    phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light2Pos, light2Intensity);
    //shadow = softShadow(p, light2Pos - p, START, END, 8.);
    //color += (1. - shadow) * phongContrib;
    return color;
}

float hue2rgb(float p, float q, float t) {
    if (t < 0.0) {
        t += 1.0;
    }
    if (t > 1.0) {
        t -= 1.0;
    }
    if (t < 1.0/6.0) {
        return p + (q - p) * 6.0 * t;
    }
    if (t < 1.0/2.0) {
        return q;
    }
    if (t < 2.0/3.0) {
        return p + (q - p) * (2.0/3.0 - t) * 6.0;
    }
    return p;
}

vec3 hsl2rgb(float h, float s, float l) {
        float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
        float p = 2.0 * l - q;
        float r = hue2rgb(p, q, h + 1.0/3.0);
        float g = hue2rgb(p, q, h);
        float b = hue2rgb(p, q, h - 1.0/3.0);
        return vec3(r, g, b);
}


void main() {

    vec3 eye = vec3(0.0, 8.0*frame/60.0/60.0 * 105.0, 0.0);
    vec3 dir = rayDir(60.0, vUv);

    float dist = march(eye, dir, START, END);

    if (dist >= END-EPSILON) {
        gl_FragColor = vec4(0.0, 0.0, 0.2, 1.0);
        return;
    }

    vec3 p = eye + dir * dist;
    vec3 boxCoord = floor(p / REP);
    vec3 color = vec3(0., 0., 1.);

    float radius = mod((frame - 9265.), 100.0) * 0.2;
    vec3 rgb = hsl2rgb(mod(frame/20.0 + boxCoord.z/10.0, 1.0), 0.5, 0.5);
    color = rgb;

    //vec3 color = vec3(vUv.x*sin(frame/6.0), vUv.y, vUv.y*0.9*cos(frame/60.0));
    color = phongIllumination(color, color, vec3(1.0, 1.0, 1.0), 10.0, p, eye);

    gl_FragColor =vec4(color, 1.0);
}

