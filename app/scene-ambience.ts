import * as THREE from 'three';
import { applyStickerFinishes } from './sticker-finishes';

/** Small, local effects preserve the illustration's flat colours and sharp edges. */
export function createSceneAmbience(computer: THREE.Object3D) {
 const ledNodes: THREE.Object3D[] = [],stickerNodes:THREE.Object3D[]=[];
 computer.updateWorldMatrix(true,true);
 computer.traverse(node=>{
  if(/^PowerLED_\d+$/.test(node.name))ledNodes.push(node);
  if(/^Sticker_[A-Za-z0-9]+$/.test(node.name))stickerNodes.push(node);
 });
 const finishes=applyStickerFinishes(computer);
 const stickers=new Map(stickerNodes.map(node=>{
  const parent=node.parent!,center=new THREE.Box3().setFromObject(node).getCenter(new THREE.Vector3());parent.worldToLocal(center);
  const pivot=new THREE.Group();pivot.name='Sticker hover pivot';pivot.position.copy(center);parent.add(pivot);pivot.attach(node);
  return [node,{pivot,rest:pivot.position.clone()}] as const;
 }));
 let hovered:THREE.Object3D|null=null,hoverStarted=0,hoverDirty=false;
 function setStickerHover(hit:THREE.Object3D|null,now:number){
  while(hit&&!stickers.has(hit))hit=hit.parent;
  if(hit===hovered)return;
  hovered=hit;hoverStarted=now;hoverDirty=true;
 }

 // Three fine, translucent ribbons drift upward and dissolve at their ends.
 const steamGroup=new THREE.Group();steamGroup.name='Coffee steam';steamGroup.position.set(3.8,.86,.85);computer.add(steamGroup);
 const steam=Array.from({length:3},(_,i)=>{
  const geometry=new THREE.PlaneGeometry(.065,.96,1,32);geometry.translate(0,.48,0);
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,
   uniforms:{uTime:{value:0},uPhase:{value:i/3},uStill:{value:0}},
   vertexShader:`varying vec2 vUv;uniform float uTime;uniform float uPhase;uniform float uStill;
    void main(){vUv=uv;vec3 p=position;float t=mix(uTime,0.,uStill);float age=fract(t*.16+uPhase);
     p.x+=sin(p.y*7.-t*1.15+uPhase*6.283)*(.025+p.y*.045);
     p.y+=age*.22;p.z+=sin(p.y*4.-t*.5+uPhase*6.283)*.025;
     gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
   fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uPhase;uniform float uStill;
    void main(){float t=mix(uTime,0.,uStill);float age=fract(t*.16+uPhase);
     float life=mix(sin(age*3.14159265),.8,uStill);
     float edge=1.-smoothstep(.22,.5,abs(vUv.x-.5));
     float ends=smoothstep(0.,.17,vUv.y)*(1.-smoothstep(.55,1.,vUv.y));
     gl_FragColor=vec4(.38,.34,.28,edge*ends*life*.42);}`
  });
  const mesh=new THREE.Mesh(geometry,material);mesh.position.x=(i-1)*.17;mesh.position.z=(i-1)*.055;mesh.rotation.y=-.62;
  mesh.frustumCulled=false;steamGroup.add(mesh);return material;
 });

 // Local light spill on the bezel remains visible against the ivory housing.
 const size=64,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const r=Math.hypot((x+.5)/size*2-1,(y+.5)/size*2-1),index=(y*size+x)*4;
  data[index]=data[index+1]=data[index+2]=255;
  data[index+3]=Math.round(Math.exp(-r*r*5)*Math.max(0,1-r)*255);
 }
 const glowMap=new THREE.DataTexture(data,size,size);glowMap.magFilter=THREE.LinearFilter;glowMap.minFilter=THREE.LinearFilter;glowMap.needsUpdate=true;
 const leds=ledNodes.sort((a,b)=>a.name.localeCompare(b.name)).map((node,index)=>{
  const center=new THREE.Box3().setFromObject(node).getCenter(new THREE.Vector3());computer.worldToLocal(center);
  const colour=index===1?0xffc43c:0x69f683;
  const glowMaterial=new THREE.MeshBasicMaterial({map:glowMap,color:colour,transparent:true,opacity:.76,depthWrite:false,toneMapped:false});
  const glow=new THREE.Mesh(new THREE.PlaneGeometry(.22,.25),glowMaterial);glow.position.copy(center);glow.position.z+=.011;computer.add(glow);
  const coreMaterial=new THREE.MeshBasicMaterial({color:index===1?0xfff2ac:0xcaffd2,toneMapped:false});
  const core=new THREE.Mesh(new THREE.CircleGeometry(1,24),coreMaterial);core.scale.set(.017,.024,1);core.position.copy(center);core.position.z+=.013;computer.add(core);
  const emissions:THREE.MeshStandardMaterial[]=[];
  node.traverse(child=>{if(child instanceof THREE.Mesh){
   const mats=(Array.isArray(child.material)?child.material:[child.material]).map(material=>{
    const clone=material.clone();if(clone instanceof THREE.MeshStandardMaterial){clone.emissive.set(colour);clone.emissiveIntensity=1.4;emissions.push(clone)}return clone;
   });child.material=Array.isArray(child.material)?mats:mats[0];
  }});
  return {glowMaterial,coreMaterial,emissions,index};
 });
 let last=-Infinity,lastMode='',elapsed=0;
 return {
  setStickerHover,
  update(now:number,outside:boolean,reduced:boolean,powered:boolean){
   const mode=`${outside}-${reduced}-${powered}`,changed=mode!==lastMode;
   if(!changed&&!hoverDirty&&(!outside||reduced||now-last<32))return false;
   if(outside&&!reduced&&Number.isFinite(last))elapsed+=Math.min((now-last)/1000,.06);
   last=now;lastMode=mode;const t=reduced?0:elapsed;
   if(!outside||reduced)hovered=null;
   const progress=(now-hoverStarted)/620,jiggling=hovered!==null&&progress>=0&&progress<1;
   stickers.forEach(({pivot,rest},node)=>{
    pivot.position.copy(rest);pivot.rotation.z=0;
    if(jiggling&&node===hovered){const decay=(1-progress)**2;pivot.rotation.z=Math.sin(progress*Math.PI*6)*.04*decay;pivot.position.x+=Math.sin(progress*Math.PI*8)*.003*decay}
   });
   finishes.update(jiggling?progress:0,jiggling?hovered!.name:null);hoverDirty=false;
   steam.forEach(material=>{material.uniforms.uTime.value=t;material.uniforms.uStill.value=reduced?1:0});
   leds.forEach(({glowMaterial,coreMaterial,emissions,index})=>{
    const breath=reduced?1:.96+Math.sin(t*.75+index*.7)*.04;
    glowMaterial.opacity=(powered?.94:.76)*breath;
    coreMaterial.color.set(index===1?0xfff2ac:0xcaffd2).multiplyScalar(breath);
    emissions.forEach(material=>{material.emissiveIntensity=(powered?1.8:1.4)*breath});
   });
   return true;
  }
 };
}
