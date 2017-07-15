uniform float iGlobalTime;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const float PI = acos(-1.);

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float hardness;
};

Material defaultMaterial = Material(
    vec3(0.25, 0.15, 0.),
    vec3(0.5, 0.25, 0.),
    vec3(1., 1., 1.),
    1024.
);

Material shenronGreen = Material(
    vec3(0., 0.15, 0.1),
    vec3(0., 0.25, 0.05),
    vec3(0.15, 1., 0.15),
    2024.
);

Material shenronRed = Material(
    vec3(0.15, 0., 0.),
    vec3(1., 0., 0.),
    vec3(1., 0., 0.),
    200.
);

Material shenronWhite = Material(
    vec3(1., 1., 1.),
    vec3(1., 1., 1.),
    vec3(1., 1., 1.),
    200.
);

Material cloudWhite = Material(
    vec3(0.05, 0.05, 0.05),
    vec3(0.5, 0.5, 0.15),
    vec3(0.65, 0.65, 0.25),
    200.
);

float smin(float a, float b, float k) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float rmin(float a, float b, float r) {
    vec2 u = max(vec2(r - a,r - b), vec2(0.));
    return max(r, min (a, b)) - length(u);
}

float rminbevel(float a, float b, float r) {
    return min(min(a, b), (a - r + b)*sqrt(0.5));
}

float rmax(float a, float b, float r) {
    vec2 u = max(vec2(r + a,r + b), vec2(0.));
    return min(-r, max (a, b)) + length(u);
}

float rmaxbevel(float a, float b, float r) {
    return max(max(a, b), (a + r + b)*sqrt(0.5));
}

vec3 repeat(vec3 p, vec3 c) {
    return mod(p,c)-0.5*c;
}

float circleRepeat(inout vec2 p, float repetitions) {
    float angle = 2. * PI / repetitions;
    float a = atan(p.y, p.x) + angle / 2.;
    float r = length(p);
    float c = floor(a / angle);
    a = mod(a, angle) - angle / 2.;
    p = vec2(cos(a), sin(a)) * r;
    // For an odd number of repetitions, fix cell index of the cell in -x direction
    // (cell index would be e.g. -5 and 5 in the two halves of the cell):
    if (abs(c) >= (repetitions/2.)) c = abs(c);
    return c;
}

mat2 rotate(float a) {
    return mat2(-sin(a), cos(a),
               cos(a), sin(a));
}

float capsule (vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float star(vec3 p) {
    p.xz *= rotate(iGlobalTime);

    float d = length(p) - cos(atan(p.x, p.y) * 5.) * 0.4;
    d = mix(d, length(p) - 0.5, 0.8);
    d = max(d, abs(p.z) - 0.05);

    return d;
}

float ballStars(vec3 p, float maxBalls) {
    float d = p.y + 200.;

    for (float i=0.; i<maxBalls; i+=1.) {
        d = min(d, star(p - vec3(sin(i + maxBalls) * 1.5, tan(i + maxBalls + 1.25) * 0.5, cos(i + maxBalls + 0.5) * 1.5)));
    }

    return d;
}

vec3 calcBallCenter(float i) {
    return vec3(
        sin(
            i - 0.7 + tan(i) * 0.35) * 15.5,
            -20. + tan(i + 1.25) * 0.75 + sin(i + iGlobalTime * i * 0.05 + cos(iGlobalTime) * 0.1) * 3.,
            cos(i + sin(i) * 10.) * 20.5
        );
}

float applyScales(vec3 p, float d) {
    vec3 w = p;
    w = repeat(w, vec3(0.75));
    d = rmin(d, max(d, length(w) - 0.15), 0.2);
    return d;
}

vec3 calcBodyPoints(float i) {
    return vec3(i * 8., cos(i) * 5. - 1.5 + i * 3. + 3., sin(i) * 5. + 3.);
}

float shenronBody(vec3 p) {
    float d = length(p);

    p.x -= 20.;

    for (float i=0.; i<10.; i+=1.) {
        d = rmin(d, capsule(p, calcBodyPoints(i - 1.), calcBodyPoints(i), 6.25), 2.);
    }

    return d;
}

float shenronEyes(vec3 p) {
    p.z = abs(p.z);
    return length(p * vec3(1.5, 1.75, 1.) - vec3(-2., 7., 4.)) - 1.5;
}

float shenronHead(vec3 p) {
    vec3 q = p;

    float d = capsule(p, vec3(0., 3., 0.), vec3(-13., 0., 0.), 2.);

    d = rmin(d, length(p - vec3(5., 1.25, 0.)) - 8., 3.);

    p.z = abs(p.z);

    d = rmin(d, capsule(p, vec3(0., 0., 4.), vec3(-10., 0., 1.5), 2.), 3.);
    d = rmin(d, capsule(p, vec3(0., 0., 6.), vec3(-5., 0., 1.5), 2.), 1.);
    d = rmin(d, capsule(p, vec3(2., 6., 6.), vec3(-2., 5., 1.5), 1.), 3.);
    d = rmin(d, capsule(p, vec3(5., 6., 5.), vec3(10., 10., 6.5), 2.), 4.);
    d = rmaxbevel(d, -(length(p * vec3(1., 1.75, 1.) - vec3(-2., 7., 4.)) - 0.5), 2.);
    d = max(d, -(length(p - vec3(-14., 1.75, 2.)) - 1.));

    d = max(d, -p.y);


    d = rmin(d, shenronBody(q), 3.);

    return d;
}

float shenronHeadUnder(vec3 p) {
    float offset = mix(0., 8.5, abs(sin(iGlobalTime * 2.)));

    float d = capsule(p, vec3(10., -1., 0.), vec3(-12. - offset * 0.2, -10. + offset, 0.), 0.01 * p.x * 13.);

    p.z = abs(p.z);
    d = rmin(d, capsule(p, vec3(0., -4.5, 6.), vec3(-13. - offset * 0.2, -11. + offset, 0.5), 0.01 * p.x * 13.), 10.);
    d = rmin(d, length(p - vec3(8., -2., 5.)) - 4., 10.);

    return d;
}

float shenronHorns(vec3 p) {
    p.z = abs(p.z);

    float d = capsule(p, vec3(10., 10., 6.5), vec3(18., 16., 6.5), 0.75);
    d = rmin(d, capsule(p, vec3(15., 14., 6.5), vec3(17., 14., 8.5), 0.4), 0.5);
    d = rmin(d, capsule(p, vec3(15., 14., 6.5), vec3(16.5, 13.5, 2.5), 0.4), 0.5);

    return d;
}

float shenronStache(vec3 p) {
    p.z = abs(p.z);

    p.y += sin(p.z * 0.25 + PI) * 2.;

    float d = capsule(p, vec3(-13., -1., 3.), vec3(30., -5., 50.), 0.1);

    return d * 0.8;
}

float teeth(vec3 p) {
    return capsule(p, vec3(0., 15.5, 0.), vec3(0., 16., 0.), 0.1) * 0.4;
}

float shenronTeeth(vec3 p) {
    p.y -= 0.5;

    vec3 q = p;
    vec3 r = p;

    // Front
    p.x -= -12.5;
    p.y -= -16.5;
    float c = circleRepeat(p.xz, 15.);
    p.x -= 1.75;

    float d = teeth(p);
    d = max(d, -(-q.x - 12.5));

    // Back
    q.z = abs(q.z);
    q.z -= p.x * 0.275;


    float rep = 0.4;
    q.x = mod(q.x, rep);
    q.x -= rep * 0.5;

    q.z -= 1.5;
    q.y -= -16.5;


    float d2 = teeth(q);

    d2 = max(d2, -(r.x + 12.5));
    d2 = max(d2, -(-r.x + 0.5));

    d = min(d, d2);
    // d = max(), -(q.x - 12.5));
    // d = min(d, length(q) - 0.5);

    return d;
}

float shenronTeethUnder(vec3 p) {
    p.y -= -3.5;
    p.yx *= rotate(PI * mix(0.35, 0.55, abs(sin(iGlobalTime * 2.))));
    return shenronTeeth(p);
}

float kintoun(vec3 p) {
    p.y -= 20.;
    p.z -= -30.;
    p.x -= -30.;

    float d = length(p * vec3(0.5, 1., 1.)) - 7.5;

    d += sin(p.x * 0.5) * sin(p.y * 0.5) * sin(p.z * 0.5);
    d = rmin(d, capsule(p, vec3(0.), vec3(-100., 0., 0.), 1.), 2.5);

    return d;
}

float map(vec3 p, bool isBalls) {
    float d = p.y + 200.;

    d = min(d, shenronHead(p));
    d = rmin(d, shenronHeadUnder(p), 1.);
    d = rmin(d, shenronStache(p), 1.);
    d = rmin(d, shenronHorns(p), 1.);
    d = rmin(d, shenronEyes(p), 1.);
    d = min(d, shenronTeeth(p));
    d = min(d, shenronTeethUnder(p));

    // d = min(d, kintoun(p));
    d = applyScales(p, d);




    // if ()


    // if (isBalls) {
    //     for (float i=0.; i<7.; i+=1.) {
    //         d = min(d, length(p - calcBallCenter(i)) - 3.5);
    //     }
    // }
    // else {
    //     for (float i=0.; i<7.; i+=1.) {
    //         d = min(d, ballStars(p - calcBallCenter(i), i));
    //     }
    // }

    return d;
}

bool isSameDistance(float distanceA, float distanceB, float eps) {
    return distanceA > distanceB - eps && distanceA < distanceB + eps;
}

bool isSameDistance(float distanceA, float distanceB) {
    return isSameDistance(distanceA, distanceB, 0.0001);
}

Material getMaterial(vec3 p, bool isBalls) {
    float distance = map(p, isBalls);


    if (isSameDistance(distance, shenronTeeth(p), 0.2)) {
        return shenronWhite;
    }
    else if (isSameDistance(distance, shenronTeethUnder(p), 0.2)) {
        return shenronWhite;
    }
    else if (isSameDistance(distance, shenronEyes(p), 0.2)) {
        return shenronRed;
    }
    else if (isSameDistance(distance, shenronHead(p), 0.3)) {
        return shenronGreen;
    }
    else if (isSameDistance(distance, kintoun(p), 0.3)) {
        return cloudWhite;
    }
    else {
        return defaultMaterial;
    }
}

vec3 getNormal(vec3 p, bool isBalls) {
    vec2 extraPolate = vec2(0.002, 0.0);

    return normalize(vec3(
        map(p + extraPolate.xyy, isBalls),
        map(p + extraPolate.yxy, isBalls),
        map(p + extraPolate.yyx, isBalls)
    ) - map(p, isBalls));
}

float intersect (vec3 rayOrigin, vec3 rayDirection, bool isBalls) {
    const float maxDistance = 100.;
    const float distanceTreshold = 0.0001;
    const int maxIterations = 50;

    float distance = 0.;
    float currentDistance = 1.;
    for (int i = 0; i < maxIterations; i++) {
        if (currentDistance < distanceTreshold || distance > maxDistance) {
            break;
        }

        vec3 p = rayOrigin + rayDirection * distance;
        currentDistance = map(p, isBalls);
        distance += currentDistance;
    }

    if (distance > maxDistance) {
        return -1.;
    }

    return distance;
}

vec3 renderMaterial(vec3 p, vec3 normal, Material material, bool isBalls, vec3 light, float lightStrength) {
    light = normalize(light);

    vec3 col = vec3(0.0);

    col += material.ambient;
    col += material.diffuse * max(dot(normal, light), 0.0);

    vec3 halfVector = normalize(light + normal);
    col += material.specular * pow(max(dot(normal, halfVector), 0.0), material.hardness / lightStrength);

    float att = clamp(1.0 - length(light - p) / lightStrength, 0.0, 1.0); att *= att;
    col *= att;

    col *= vec3(smoothstep(0.25, 0.75, map(p + light, isBalls))) + 0.5;

    return col;
}

vec3 render(vec2 q, vec3 cameraPosition, vec3 rayDirection, bool isBalls) {
    float distance = intersect(cameraPosition, rayDirection, isBalls);

    // vec3 col = vec3(0.02, 0.015, 0.05);

    vec3 col = vec3(0.025, 0.025, cos(q.y * 2.) * 0.5 - 0.25);

    if (distance > 0.0) {
        vec3 p = cameraPosition + rayDirection * distance;

        vec3 normal = getNormal(p, isBalls);

        Material material = getMaterial(p, isBalls);

        col = renderMaterial(p, normal, material, isBalls, vec3(10.0, 20.0, -52.0), 20.);
        col += renderMaterial(p, normal, material, isBalls, vec3(20.0, 15.0, 55.0), 50.);
        col += renderMaterial(p, normal, material, isBalls, vec3(-15.0, -15.0, 55.0), 100.);
        col /= 3.;
    }

    return col;
}

void main() {
    vec2 p = vUv;

    p = 2. * p - 1.;
    p.x *= 16. / 9.;

    vec3 cameraPosition = vec3(0.0, 0., 30.0);
    vec3 rayDirection = normalize(vec3(p, -1.0));

    float b = 1.25 + sin(iGlobalTime) * 0.5;
    b = PI * 0.4;
    rayDirection.zy *= rotate(b);
    cameraPosition.zy *= rotate(b);

    float a = PI * 1.5 + sin(iGlobalTime);
    a = -PI * 0.25;
    rayDirection.xz *= rotate(a);
    cameraPosition.xz *= rotate(a);

    vec3 col;

    col = render(p, cameraPosition, rayDirection, false);
    col += render(p, cameraPosition, rayDirection, true) * 1.;

    col *= 1.95;

    gl_FragColor = vec4(col, 1.);
    // gl_FragColor = vec4(0.25, 1., 0., 1.);
}
