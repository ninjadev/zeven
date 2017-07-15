#define M_PI 3.1415926535897932384626433832795
uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    float y = (vUv.y-0.5)*2.0; // [-1, 1]

    float fisheye_radius = 1.0;

    float angle = asin(y/fisheye_radius); // [-pi/2, pi/2]
    float arc_length = angle * fisheye_radius; // calculate arc length

    float max_arc_length = asin(1.0 / fisheye_radius) * fisheye_radius;
    float normalized_arc_length = (arc_length + max_arc_length) / (max_arc_length * 2.0);

    gl_FragColor = vec4(arc_length);
    gl_FragColor = texture2D(tDiffuse, vec2(vUv.x, normalized_arc_length)); // set arc_length as y
}
