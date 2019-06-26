#version 330 compatibility
in vec3 vColor;
in vec2 vST;
in float vLightIntensity;
uniform float uAd;
uniform float uBd;
uniform float uTol;

void
main()
{
    //float uAd = .1;
    //float uBd = .18;
    //float uTol = 0;
    float s = vST.s;
    float t = vST.t;
    float Ar = uAd/2.;
    float Br = uBd/2.;
    int numins = int (s/uAd);
    int numint = int (t/uBd);
    float sc = (numins * uAd) + Ar;
    float tc = (numint * uBd) + Br;
    float sf = pow((s-sc), 2)/ pow(Ar, 2);
    float tf = pow((t-tc), 2)/ pow(Br, 2);
    float el = sf + tf;
    float d = smoothstep(1-uTol, 1+uTol, el);

    float show = step(1, el);

    vec3 rgb;
    if (d > 0){
        rgb = mix(vColor, vec3(1., 1., 1.),  d);

    }else {
        rgb = mix(vColor, vec3(1., 1., 1.),  show);
    }
    gl_FragColor = vec4 (rgb, 1.);
}