uniform float frame;
uniform sampler2D tDiffuse;
#define PI 3.141592653589793

varying vec2 vUv;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(
        oc * axis.x * axis.x + c,
        oc * axis.x * axis.y - axis.z * s,
        oc * axis.z * axis.x + axis.y * s,

        0.0,
        oc * axis.x * axis.y + axis.z * s,
        oc * axis.y * axis.y + c,
        oc * axis.y * axis.z - axis.x * s,
        0.0,

        oc * axis.z * axis.x - axis.y * s,
        oc * axis.y * axis.z + axis.x * s,
        oc * axis.z * axis.z + c,
        0.0,

        0.0,
        0.0,
        0.0,
        1.0);
}

float sphere(vec3 position, vec3 sphere, float radius) {
    return length(position - sphere) - radius;
}

float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


float torus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float displacement(vec3 p) {
    return 1.5 * sin(frame / 90. + .9 * p.x) * sin(.5 * p.x) * sin(.9 * p.z);
}

float cylinder( vec3 p, vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float hexPrism(vec3 p, vec2 h) {
    vec3 q = abs(p);
    return max(q.z - h.y, max((q.x * 0.866025 + q.y * 0.5), q.y) - h.x);
}

float smin(float a, float b, float k) {
    float res = exp(-k * a) + exp(-k * b);
    return -log(res) / k;
}

float spinner(vec3 p, float angle, float speed) {
    p.x += 5. * sin(frame / 17. * speed);
    p.z += 5. * cos((100. + p.y) / 10. + frame / 17. * speed);
    vec3 rotatedP = (rotationMatrix(
            vec3(1., 0., 0.), PI / 2.) * vec4(p, 1.)).xyz;
    rotatedP = (rotationMatrix(
            vec3(0., 0., 1.),
            angle + frame / 100. + (100. + p.y) / 40.) *
        vec4(rotatedP, 1.)).xyz;
    float t = hexPrism(rotatedP, vec2(1., frame / 4.));
    return t;
}

float map(vec3 p) {
    float t = spinner(p, 0., 1.);
    t = smin(t, spinner(p, 2. * PI / 3., 0.9), 1. / 2.);
    t = smin(t, spinner(p, 2. * 2. * PI / 3., 0.8), 1. / 2.);
    //t += displacement(p);
    return t;
}

float castRay(vec3 ro, vec3 rd, float sizeChange) {
    float totalDistance = 0.0;
    const int maxSteps = 128;

    for(int i = 0; i < maxSteps; ++i) {
        vec3 p = ro + rd * totalDistance;
        float d = map(p*(1. + sizeChange));
        if(d < 0.001 || totalDistance >= 40.0) {
            break;
        }

        totalDistance += d;
    }
    return totalDistance;
}

vec3 calculateNormal(vec3 pos) {
    vec3 eps = vec3(0.001, 0.0, 0.0);
    vec3 normal = vec3(
            map(pos + eps.xyy) - map(pos - eps.xyy),
            map(pos + eps.yxy) - map(pos - eps.yxy),
            map(pos + eps.yyx) - map(pos - eps.yyx));
    return normalize(normal);
}


vec4 background(vec2 uv) {
    return vec4(.5, .5, 1., 1.);
}

void main() {
    float x = (vUv.x * 16.0) - 8.0;
    float y = (vUv.y * 9.0) - 4.5;
    float fov = 18.0;

    vec3 eye = vec3(0., frame / 5., 50.);
    vec3 forward = vec3(0., 0., -1.);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = cross(forward, up);

    vec3 rayOrigin = eye + (right * x) + (up * y) + (forward * fov);
    vec3 rayDestination = normalize(rayOrigin - eye);

    vec3 light = normalize(vec3(-10., 0., 10.));

    float farClippingPlane = 40.0;

    float blackColDistance = castRay(rayOrigin, rayDestination, -0.03);;
    vec4 blackCol = vec4(0.);

    float totalDistance = castRay(rayOrigin, rayDestination, 0.0);
    vec4 color = vec4(1.);
    vec3 pos = rayOrigin + forward * totalDistance;
    vec3 surfaceNormal = calculateNormal(pos);
    float diffusion = clamp(dot(surfaceNormal, light), 0.0, 1.0);
    float ambiance = 0.5;

    diffusion = step(0.0, diffusion);

    if(blackColDistance < farClippingPlane) {
        //color = vec4(.0, .0, .0, 1.);
    }

    if(totalDistance < farClippingPlane) {
        color = (ambiance + diffusion * (1. - ambiance)) * 0.9 * vec4(1.0, 0.66, 0., 1.) * 1.;
    }
    //color = vec4(surfaceNormal, 1.);

    if(totalDistance > farClippingPlane) {
        color = background(vUv);
    }

    gl_FragColor = color;
}
