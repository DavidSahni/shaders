#version 330 compatibility
#extension GL_EXT_geometry_shader4: enable
#extension GL_EXT_gpu_shader4: enable

layout( triangles )  in;
layout( points, max_vertices=170 )  out;

uniform float Timer;
uniform sampler2D Noise2;

out float gLightIntensity;
out float yPos;
in vec2 vST[3];
const vec3 LightPos = vec3( 0., 0., 10. );


vec3	V0, V01, V02;
vec3	CG;
vec3	N0, N01, N02;
vec2	st01, st02;
vec3 	Normal;

//tS: triangle subdivision S
//tT: triangle subdivision T
vec2 findNewST(float tS, float tT){
 //distance between 0-1 and 0 - 2
	st01 *= vec2(tS, 0);
	st02 *= vec2(0, tT);
	return vST[0] + st01 + st02;
}


float getNoise(vec2 vert){
	vec4 nv  = texture3D( Noise3, 10.*vert );
    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n - 2.;                             // -1. -> 1.

    n *= 2.5;
	return n;
}



//if t <=  Timer * 10 /8 fly
//then tVel = min((Timer* 10 /8 - t) * 2,1);
void
ProduceVertex( float s, float t )
{
	vec2 st = findNewST(s, t);

	vec3 v = V0 + s*V01 + t*V02;
	yPos = v.y;
	float noise = getNoise(st);
	st.t = abs(min(st.t + noise, 1));
	gLightIntensity  = abs(  dot( normalize(LightPos - v), Normal )  );

	float tStart = (5.5/10.) * st.t;
	float tStop = 1;
	float tVel = smoothstep(tStart, tStop, Timer);
	vec3 vel = 1. * vec3(-1.1*noise *noise, .8, 0);
	v = v + vel*tVel + 0.5*vec3(-0.5/2., 0.5, 0.)*tVel*tVel;
	yPos = (v.y - yPos) +(abs(noise) * smoothstep(0, .5, tVel));
	gl_Position = gl_ModelViewProjectionMatrix * vec4( v, 1. );
	EmitVertex( );
}



//start t = 0 and go to t = 1, very easy!
//to stagger: find out how far from beg your t is, 
void
main( )
{
	V01 = ( gl_PositionIn[1] - gl_PositionIn[0] ).xyz;
	V02 = ( gl_PositionIn[2] - gl_PositionIn[0] ).xyz;


	Normal = normalize( cross( V01, V02 ) );

	V0  =   gl_PositionIn[0].xyz;
	CG = ( gl_PositionIn[0].xyz + gl_PositionIn[1].xyz + gl_PositionIn[2].xyz ) / 3.;

	st01 = vST[0] - vST[1];
	st02 = vST[0] - vST[2];


	int numLayers = 1 << 4;

	float dt = 1. / float( numLayers );
	float t = 1.;

	for( int it = 0; it <= numLayers; it++ )
	{
		float smax = 1. - t;
		int nums = it + 1;
		float ds = smax / float( nums - 1 );
		float s = 0.;

		for( int is = 0; is < nums; is++ )
		{
			ProduceVertex( s, t );
			s += ds;
		}

		t -= dt;
	}
}
