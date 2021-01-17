#ifdef GL_ES
precision highp float;
#endif
#define PI 3.141592

uniform vec2 resolution;
uniform float time;
uniform sampler2D tex;
uniform sampler2D bbTex;

void main(){
  vec3 outCol = vec3(.0);
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 uv2 = uv;
  uv2.y = 1.0 - uv2.y;
  //uv.y = 1.0 - uv.y;
  vec3 t = texture2D(tex, uv).rgb;
  vec3 bb = texture2D(bbTex, uv).rgb;
  float bbAvg = (bb.r + bb.g + bb.b) / 3.0;
  vec3 bbGrey = vec3(bbAvg);
  outCol = t + bbGrey * 0.9;
  
  gl_FragColor = vec4(outCol, 1.0);
}