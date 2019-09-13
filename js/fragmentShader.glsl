uniform float time;
uniform vec2 resolution;
uniform vec2 imgResolution;
uniform sampler2D texture;
varying vec2 vUv;
uniform float u_hover;
uniform float u_uvrate;
// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main()	{
    vec2 xy = vUv;

    float d = distance( xy, vec2(.5,.5));
    float scale = .15;

    vec2 scaleCenter = vec2(0.5, 0.5);

    xy = (xy - scaleCenter) / (1. + scale * u_hover) + scaleCenter;
    // xy.x -= ( xy.x - .5 ) - (u_hover * scale);
    // xy.y -= ( xy.y - .5 ) - (u_hover * scale) * u_uvrate;

    // xy.x = xy.x + ( xy.y - .5 ) * ( xy.y - .5 )  / 5.;

    vec4 color = texture2D(texture, xy);

    if( xy.x < 0. || xy.x > 1. ) {
        // color = vec4(1.);
    }

    // color = vec4(1., 0., 1., 1.);

    // textureColor.r += noise(xy) / 5.;
    // textureColor.g += noise(xy) / 15.;
    // textureColor.b += noise(xy) / 3.;

    gl_FragColor = color;
}