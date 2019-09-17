uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
varying vec2 vUv;
uniform float u_hover;
uniform float u_pos;
uniform float u_uvrate;
void main()	{
	vec2 uv = vUv;

	vec4 rgba = vec4(1., 1., 1., 1.);

	if ( uv.y > sin(uv.x * 2.) ) {
		// rgba.r = 1.;
	}

	float pi = 3.1415;

	float law;
	float period;
	float phase;

	float coord = 0.;
	float p = 0.;
	float intervalSize = .04;

	for( float i = -12.; i <= 12.; i++ ) {
		float i_i = i + fract( -u_pos * .004 );
		float interval = i_i * intervalSize;

		law = (uv.x - 0.5) * (uv.x - 0.5) * i_i + interval + .5; // - i / 10.
		coord = smoothstep( uv.y -.002, uv.y + .002, law );

		p += coord * ( 1. - coord);
	}

	rgba = vec4( 0.1, 0.1, 0.1, p );

	gl_FragColor = rgba;
}