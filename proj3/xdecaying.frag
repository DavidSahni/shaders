#version 330 compatibility
uniform float uKa, uKd, uKs;
uniform vec4 uColor;
uniform vec4 uSpecularColor;
uniform float uShininess;
uniform float uNoiseAmp, uNoiseFreq;
uniform float uLightX, uLightY, uLightZ;
uniform float uA, uB, uC, uD, uE;
//uniform float uReflectUnit, uRefractUnit, uEta, uMix;
in vec3 vECposition;
in vec3 vMCposition;
uniform sampler3D Noise3;
#define pi 3.1415926535897932384626433832795

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

out vec4 fFragColor;
vec3 RotateNormal(float,float,vec3);

void
main( )
{


    vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

    vec3 vertex = vMCposition;
    float x = vertex.x + 1;
    float y = vertex.y + 1;

    float z = uA * (cos(2*pi*uB*x + uC) * exp(-uD * x)) * exp(-uE*y);
    vertex.z = z;

    float dzdx = uA * ( -sin(2.*pi*uB*x+uC) * 2.*pi*uB * exp(-uD*x) + cos(2.*pi*uB*x+uC) * -uD * exp(-uD*x) ) * ( exp(-uE*y) );

    float dzdy = uA * ( cos(2.*pi*uB*x+uC) * exp(-uD*x) ) * ( -uE * exp(-uE*y) ); 

    vec3 Tx = vec3(1., 0., dzdx );

    vec3 Ty = vec3(0., 1., dzdy ); 
    vec3 normal = normalize(cross(Tx, Ty));

    vec3 Nf = normal; // surface normal vector WRONG NORMAL ATM
    vec3 vNs = Nf;
    vec3 vLs = eyeLightPosition - vECposition.xyz;    // vector from the point
    // to the light position
    vec3 vEs = vec3( 0., 0., 0. ) - vECposition.xyz;



    vec3 Normal = normalize(vNs);
    Normal = RotateNormal(angx, angy, Normal);
    vec3 Light  = normalize(vLs);
    vec3 Eye    = normalize(vEs);
    vec4 ambient =uKa * uColor;
    float d = max(dot(Normal, Light), 0);
    vec4 diffuse = uKd *d*uColor;
    float s = 0;
    if (dot(Normal,Light) > 0){
        vec3 ref = normalize(2 * Normal * dot(Normal,Light) - Light);
        s = pow(max(dot(Eye,ref), 0), uShininess);
    }

    vec4 specular = uKs * s * uSpecularColor;
    fFragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb, 1.);
}


vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}