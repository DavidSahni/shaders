#version 330 compatibility

const float PI = 3.14159265;
const float TWOPI = 2.*PI;

uniform float uA, uB, uC, uD, uE;

out vec3 vNs;
out vec3 vMC;
out vec3 vEC;

void
main( )
{
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;

	vec4 ECposition = gl_ModelViewMatrix * newVertex;
	vEC = ECposition.xyz;

	float x = newVertex.x + 1;
    float y = newVertex.y + 1;

	float dzdx = uA * ( -sin(TWOPI*uB*x+uC)* TWOPI * uB * exp(-uD*x)  +  cos(TWOPI*uB*x+uC) * -uD * exp(-uD*x) ) * ( exp(-uE*y) );
	vec3 xtangent = vec3( 1., 0., dzdx );

	float dzdy =  uA * cos(TWOPI*uB*x+uC) * exp(-uD*x) * -uE * exp( -uE*y );
	vec3 ytangent = vec3( 0., 1., dzdy );

	vec3 newNormal = normalize(  gl_NormalMatrix * cross( xtangent, ytangent )  );
	vNs = newNormal;
	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}
