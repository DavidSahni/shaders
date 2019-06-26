#version 330 compatibility

uniform sampler2D uImageUnit;
uniform float uScenter, uTcenter;
uniform float uDr;
uniform float uMagFactor, uRotAngle, uSharpFactor;
in vec2	vST;

vec3 sharpST(vec2 st){

    ivec2 ires = textureSize(uImageUnit, 0);
    float ResS = float(ires.s);
    float ResT = float(ires.t);
    vec2 stp0 = vec2(1./ResS, 0.);
    vec2 st0p = vec2(0., 1./ResT);
    vec2 stpp = vec2(1./ResS,  1./ResT);
    vec2 stpm = vec2(1./ResS, -1./ResT);
    vec3 i00 =   texture2D( uImageUnit, st ).rgb;
    vec3 im1m1 = texture2D( uImageUnit, st-stpp ).rgb;
    vec3 ip1p1 = texture2D( uImageUnit, st+stpp ).rgb;
    vec3 im1p1 = texture2D( uImageUnit, st-stpm ).rgb;
    vec3 ip1m1 = texture2D( uImageUnit, st+stpm ).rgb;
    vec3 im10 =  texture2D( uImageUnit, st-stp0 ).rgb;
    vec3 ip10 =  texture2D( uImageUnit, st+stp0 ).rgb;
    vec3 i0m1 =  texture2D( uImageUnit, st-st0p ).rgb;
    vec3 i0p1 =  texture2D( uImageUnit, st+st0p ).rgb;
    vec3 target = vec3(0.,0.,0.);
    target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
    target += 2.*(im10+ip10+i0m1+i0p1);
    target += 4.*(i00);
    target /= 16.;
    return vec3( mix( target, i00, uSharpFactor ));
}

void main( )
{   
    vec2 st = vST;
    float dist = sqrt(pow(st.s - uScenter, 2) + pow(st.t - uTcenter, 2));
   	vec3 newcolor = texture2D( uImageUnit, st ).rgb;
    if (dist < uDr){
        float sAng = sin(uRotAngle);
        float cAng = cos(uRotAngle);
        float sD = st.s - uScenter;
        float tD = st.t - uTcenter;
        sD /= uMagFactor;
        tD /= uMagFactor;
        float sDR = sD*cAng - tD*sAng;
        float tDR = sD*sAng + tD*cAng;
        st.s = uScenter + sDR;
        st.t = uTcenter + tDR;

        newcolor = sharpST(st);

        
    }
	gl_FragColor = vec4( newcolor, 1. );
}





