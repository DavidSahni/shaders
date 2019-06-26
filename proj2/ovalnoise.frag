#version 330 compatibility
in vec3 vColor;
in vec2 vST;
in float vLightIntensity;
in vec3 vMCposition;
uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler3D Noise3;
uniform float uAlpha;

void
main()
{
    float alpha = uAlpha;
    vec4 nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n - 2.;                             // -1. -> 1.

    n *= uNoiseAmp;


    float s = vST.s;
    float t = vST.t;
    float Ar = uAd/2.;
    float Br = uBd/2.;
    int numins = int (s/uAd);
    int numint = int (t/uBd);
    float sc = (numins * uAd) + Ar;
    float tc = (numint * uBd) + Br;

    float sd = s - sc;
    float td = t - tc;

    float oldDist = sqrt( sd*sd + td*td );
    float newDist = oldDist + n;
    float scale = newDist / oldDist;

    sd *= scale;
    td *= scale;

    sd /= Ar;
    td /= Br;


    float el = sd*sd + td*td;
    float d = smoothstep(1-uTol, 1+uTol, el);

    float show = step(1, el);

    vec3 rgb;

    rgb = mix(vColor, vec3(1., 1., 1.),  d);
    if (show == 0){
        alpha = 1;
    }else if (alpha == 0){
        discard;
    }
    gl_FragColor = vec4 (rgb, alpha);
}