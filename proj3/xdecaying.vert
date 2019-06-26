#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uA, uB, uC, uD, uE;
out vec3 vMCposition;
out vec3 vECposition;

void
main( )
{ 

    vec4 vertex = gl_Vertex;
    
    // vector from the point
    // to the eye position 

    //displacement mapping


	vMCposition  = vertex.xyz;
    vECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}