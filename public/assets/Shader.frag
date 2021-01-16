#ifdef GL_ES
precision highp float;
#endif
#define PI 3.141592

uniform vec2 resolution;
uniform float time;
uniform sampler2D tex;


float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 pc(vec2 uv, vec2 d){
  vec2 st = gl_FragCoord.xy;
  
  return (st - d) / resolution.xy;
}
void main(){
  vec3 outCol = vec3(.0);
  vec2 uv = gl_FragCoord.xy / resolution;

  uv.x += 0.0005 * cos(tan(time * 0.1  + uv.y * 10.0));
  uv.x += 0.0003 * tan(tan(time * 0.01  + uv.y * 10.0));
  uv.y += 0.0005 * sin(tan(time * 0.1  + uv.x * 10.0));

  //uv.y = 1.0 - uv.y;
  outCol = texture2D(tex, uv).rgb;
  //outCol *= noise(uv.xy * 1000.0) * 2.0;
  float dist = 1.0;
  
  if (outCol.r < 0.001){
  for (float i = .0; i < 100.0; i++){
    if (i > dist) break;
    if (texture2D(tex, pc(uv, vec2(i, .0))).r > 0.5){
      outCol.r += 1.0;
    }
    if (texture2D(tex, pc(uv, vec2(.0, -i))).b > 0.5){
      outCol.b += 1.0;
    }
  }
  }
  
  
  
  float avg = (outCol.r + outCol.g + outCol.b) / 3.0;
  gl_FragColor = vec4(outCol, 1.0);
}