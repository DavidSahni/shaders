#version 330 compatibility
in float gLightIntensity;
in float yPos;

const vec3 GRAY = vec3(0,0, 0);

void
main( )
{

	if (yPos >= .55){
		discard;
	}
	float mxVal = yPos * 2;
	vec3 color = mix(vec3(0., 1., 0.), GRAY, mxVal);
	gl_FragColor = vec4(  gLightIntensity*color, 1. - yPos );
}
