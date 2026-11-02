import * as THREE from 'three';

const vertexShader=`
 varying vec3 vWorld; varying vec3 vNormal;
 void main(){vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*world;}
`;
const fragmentShader=`
 varying vec3 vWorld;varying vec3 vNormal;
 uniform float uTime;uniform float uKind;uniform vec2 uCenter;uniform vec2 uSize;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 void main(){
  vec2 uv=(vWorld.xy-uCenter)/uSize+.5;
  vec3 V=normalize(cameraPosition-vWorld);vec3 N=normalize(vNormal);if(dot(N,V)<0.)N=-N;
  float fresnel=pow(1.-clamp(dot(N,V),0.,1.),3.);
  float strip=uv.x*.65+uv.y-(.77+V.x*.28);
  float soft=exp(-strip*strip/.018);float thin=exp(-pow(strip-.11,2.)/.0012);
  vec3 color;
  if(uKind<.5){
   float phase=uv.x*.62+uv.y*.38+V.x*.78+sin(uTime*.24)*.045;
   vec3 spectrum=.48+.45*cos(6.2831853*(phase+vec3(0.,.333,.667)));
   color=mix(vec3(.69,.73,.79),spectrum,.72);
   float grooves=sin((uv.x*.7+uv.y)*360.);float aa=1.-smoothstep(.2,.8,fwidth((uv.x*.7+uv.y)*360.));
   color+=grooves*.025*aa+soft*.22+thin*.13+fresnel*.12;
  }else if(uKind<1.5){
   float density=clamp(.35/max(max(fwidth(uv.x),fwidth(uv.y)),.0001),14.,65.);
   vec2 cell=floor(uv*density);float grain=hash(cell);float facet=hash(cell+vec2(31.,9.));
   color=mix(vec3(.23,.12,.019),vec3(.85,.64,.19),grain);
   float sparkle=pow(.5+.5*sin(uTime*.95+grain*82.+V.x*8.+V.y*5.),10.);
   color+=step(.87,facet)*sparkle*vec3(.68,.58,.34);
   color=mix(color,vec3(.96,.87,.53),step(.975,grain)*.75);
   color+=soft*.08;
  }else if(uKind<2.5){
   color=vec3(.0075,.0085,.012)+vec3(.72,.8,1.)*(soft*.042+thin*.013+fresnel*.018);
  }else{
   color=vec3(.184,.784,.102)+vec3(.8,1.,.7)*(soft*.045+thin*.018+fresnel*.022);
  }
  gl_FragColor=vec4(color,1.);
  #include <colorspace_fragment>
 }
`;

export function applyStickerFinishes(computer:THREE.Object3D){
 const specs=[
  {prefix:'Finish_Holographic',kind:0,center:[-1.74,.53],size:[.76,.41]},
  {prefix:'Finish_Gold',kind:1,center:[-.04,.365],size:[.33,.33]},
  {prefix:'Finish_BlackPlastic',kind:2,center:[-1.73,1.6],size:[.36,.40]},
  {prefix:'Finish_AlienVinyl',kind:3,center:[.723706,.559595],size:[.432,.64]},
 ];
 const materials=new Map<number,THREE.ShaderMaterial>();
 computer.traverse(node=>{if(node instanceof THREE.Mesh){
  const original=Array.isArray(node.material)?node.material:[node.material];
  const next=original.map(material=>{
   const spec=specs.find(s=>material.name.startsWith(s.prefix));if(!spec)return material;
   let finish=materials.get(spec.kind);
   if(!finish){finish=new THREE.ShaderMaterial({name:spec.prefix,vertexShader,fragmentShader,side:THREE.DoubleSide,toneMapped:false,
    uniforms:{uTime:{value:0},uKind:{value:spec.kind},uCenter:{value:new THREE.Vector2(spec.center[0],spec.center[1])},uSize:{value:new THREE.Vector2(spec.size[0],spec.size[1])}}});materials.set(spec.kind,finish)}
   return finish;
  });node.material=Array.isArray(node.material)?next:next[0];
 }});
 return {update(time:number,hovered:string|null=null){
  const active=hovered==='Sticker_UFO'?0:hovered==='Sticker_Star'?1:hovered==='Sticker_Cat'?2:hovered==='Sticker_Alien'?3:-1;
  materials.forEach((material,kind)=>{material.uniforms.uTime.value=kind===active?time:0});
 }};
}
