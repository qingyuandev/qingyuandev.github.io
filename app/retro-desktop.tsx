'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DesktopOS, { type DesktopProject } from './desktop-os';

export default function RetroDesktop({items}:{items:DesktopProject[]}) {
 const guide=useRef<HTMLDivElement>(null);
 const mount=useRef<HTMLDivElement>(null),stageRef=useRef(0),flatRef=useRef(false),[stage,setStage]=useState(0),[flat,setFlat]=useState(false),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[screen,setScreen]=useState<HTMLDivElement|null>(null),[flatTarget,setFlatTarget]=useState<HTMLDivElement|null>(null),enterButton=useRef<HTMLButtonElement>(null);
 function move(next:number){stageRef.current=next;setStage(next)}
 useEffect(()=>{flatRef.current=flat;if(flat){const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;enterButton.current?.focus()}}},[flat]);
 useEffect(()=>{if(screen)screen.inert=stage!==2||flat},[screen,stage,flat]);
 useEffect(()=>{if(!screen||!flatTarget||!flat)return;const parent=screen.parentElement,styles=screen.style.cssText;flatTarget.appendChild(screen);screen.style.cssText='width:100%;height:100%;position:relative;transform:none;';screen.inert=false;return()=>{screen.style.cssText=styles;parent?.appendChild(screen);screen.inert=stageRef.current!==2}},[flat,screen,flatTarget]);
 useEffect(()=>{if(!flat||!flatTarget)return;const dialog=flatTarget.parentElement!;const previous=document.activeElement as HTMLElement|null;const siblings:{node:HTMLElement;inert:boolean}[]=[];let branch:HTMLElement=dialog;while(branch.parentElement&&branch!==document.body){Array.from(branch.parentElement.children).forEach(node=>{if(node!==branch&&node instanceof HTMLElement){siblings.push({node,inert:node.inert});node.inert=true}});branch=branch.parentElement}dialog.querySelector<HTMLButtonElement>('button')?.focus();const trap=(e:KeyboardEvent)=>{if(e.key!=='Tab')return;const nodes=Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],video[controls],iframe')).filter(n=>n.getClientRects().length>0);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}};dialog.addEventListener('keydown',trap);return()=>{siblings.forEach(({node,inert})=>{node.inert=inert});dialog.removeEventListener('keydown',trap);previous?.focus()}},[flat,flatTarget]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(flat)setFlat(false);else if(stage>0)move(0)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[flat,stage]);
 useEffect(()=>{
  let cancelled=false,dispose=()=>{};
  async function setup(){
   const THREE=await import('three');const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');const {CSS3DRenderer,CSS3DObject}=await import('three/addons/renderers/CSS3DRenderer.js');const {createSceneAmbience}=await import('./scene-ambience');
   if(cancelled||!mount.current)return;
   const host=mount.current,renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;renderer.toneMappingExposure=1;renderer.shadowMap.enabled=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
   const css=new CSS3DRenderer();css.domElement.className='studio-css';renderer.domElement.className='studio-webgl';renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(css.domElement);host.appendChild(renderer.domElement);
   const scene=new THREE.Scene(),domScene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36.86989765,1,.1,100);
   const gltf=await new GLTFLoader().loadAsync('/models/reference-computer.glb?v=smile-star-nudge');
   if(cancelled){gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose())}});renderer.dispose();renderer.domElement.remove();css.domElement.remove();return}
   const computer=gltf.scene;scene.add(computer);const screenCovers:InstanceType<typeof THREE.Object3D>[]=[];
   computer.traverse(o=>{if(o.name.startsWith('ScreenCover'))screenCovers.push(o)});
   const keys=new Map<InstanceType<typeof THREE.Object3D>,{rest:number;pressedAt:number}>();
   computer.traverse(o=>{if(o.name.startsWith('Keycap_')&&!o.parent?.name.startsWith('Keycap_'))keys.set(o,{rest:o.position.y,pressedAt:-Infinity})});
   const ambience=createSceneAmbience(computer);
   let powerOn=false,powerAt=-Infinity;
   // Transparent depth-writing aperture reveals the DOM behind the WebGL canvas.
   const aperture=new THREE.Mesh(new THREE.PlaneGeometry(2.96,2.368),new THREE.MeshBasicMaterial({color:0x000000,opacity:0,transparent:true,blending:THREE.NoBlending}));aperture.position.set(0,2.97,.659);scene.add(aperture);
   const element=document.createElement('div');element.className='physical-screen';element.style.width='1280px';element.style.height='1024px';element.inert=true;setScreen(element);
   const screenObject=new CSS3DObject(element);screenObject.position.copy(aperture.position);screenObject.scale.setScalar(2.96/1280);domScene.add(screenObject);
   // A separate glass layer keeps DOM text interactive under a recessed CRT surface.
   const glassMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,toneMapped:false,uniforms:{uStrength:{value:1}},vertexShader:`varying vec2 vUv; varying vec3 vWorld; void main(){vUv=uv;vec4 world=modelMatrix*vec4(position,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,fragmentShader:`
    precision highp float;varying vec2 vUv;varying vec3 vWorld;uniform float uStrength;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){vec2 p=abs(vUv-.5)*2.;float edge=pow(max(p.x,p.y),10.);float corners=pow(length(p)*.7071,6.);float view=1.-abs(normalize(cameraPosition-vWorld).z);float reflection=exp(-pow((vUv.x*.7+vUv.y)-1.03,2.)/.016)*.047;float haze=exp(-length((vUv-vec2(.23,.7))*vec2(1.2,1.)))*.024;float grain=hash(floor(vUv*vec2(1600.,1280.)))*.022;float shadow=edge*.62+corners*.10+view*.17;float light=reflection+haze+grain;float a=clamp(shadow+light,0.,.78)*uStrength;vec3 c=mix(vec3(.035,.055,.055),vec3(.88,.92,.89),light/max(shadow+light,.001));gl_FragColor=vec4(c,a);}
   `});const glass=new THREE.Mesh(new THREE.PlaneGeometry(2.958,2.366),glassMaterial);glass.position.set(0,2.97,.669);glass.renderOrder=10;scene.add(glass);
   const bootMaterial=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,depthWrite:false,opacity:0,toneMapped:false});
   const bootVeil=new THREE.Mesh(new THREE.PlaneGeometry(2.96,2.368),bootMaterial);bootVeil.position.set(0,2.97,.676);bootVeil.renderOrder=9;bootVeil.visible=false;scene.add(bootVeil);
   const guidePoint=new THREE.Vector3();
   const target=new THREE.Vector3(.65,1.45,.55),destination=new THREE.Vector3(),focus=new THREE.Vector3();let frame=0,last=0,visible=true,aspect=1,dirty=true,previousStage=-1;const reduced=matchMedia('(prefers-reduced-motion: reduce)');camera.position.set(-7.8,3.45,10.8);camera.lookAt(target);
   function resize(){const w=host.clientWidth,h=host.clientHeight;aspect=w/h;camera.aspect=aspect;camera.updateProjectionMatrix();renderer.setSize(w,h);css.setSize(w,h);dirty=true}
   const observer=new ResizeObserver(resize);observer.observe(host);resize();const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting});intersection.observe(host);
   const lost=(e:Event)=>{e.preventDefault();setFailed(true)};renderer.domElement.addEventListener('webglcontextlost',lost);
   const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
   const orbit=new THREE.Spherical(),offset=new THREE.Vector3();
   let yaw=0,pitch=0,drag:{id:number;x:number;y:number;yaw:number;pitch:number;moved:boolean}|null=null;
   let wheelTotal=0,lastWheel=0,wheelDirection=0,wheelLockedUntil=0;
   function enterScreen(){ambience.setStickerHover(null,performance.now());yaw=0;pitch=0;wheelTotal=0;wheelLockedUntil=performance.now()+1000;if(innerWidth<700)setFlat(true);else move(2)}
   function screenHit(x:number,y:number){
    const bounds=host.getBoundingClientRect();pointer.set((x-bounds.left)/bounds.width*2-1,-(y-bounds.top)/bounds.height*2+1);
    camera.updateMatrixWorld();scene.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObject(aperture)[0],front=raycaster.intersectObject(computer,true)[0];
    return !!hit&&(!front||front.distance>=hit.distance-.08);
   }
   function keyHit(x:number,y:number){
    const bounds=host.getBoundingClientRect();pointer.set((x-bounds.left)/bounds.width*2-1,-(y-bounds.top)/bounds.height*2+1);
    camera.updateMatrixWorld();scene.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera);
    let obj:InstanceType<typeof THREE.Object3D>|null=raycaster.intersectObject(computer,true)[0]?.object??null;
    while(obj&&!keys.has(obj))obj=obj.parent;
    return obj;
   }
   function pressKey(key:InstanceType<typeof THREE.Object3D>){
    keys.get(key)!.pressedAt=performance.now();dirty=true;
    if(!powerOn){powerOn=true;powerAt=performance.now();screenCovers.forEach(o=>{o.visible=false})}
   }
   function pointerDown(e:PointerEvent){
    if(stageRef.current>=2||flatRef.current||!e.isPrimary||e.button!==0)return;
    ambience.setStickerHover(null,performance.now());
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw,pitch,moved:false};host.setPointerCapture(e.pointerId);
   }
   function pointerMove(e:PointerEvent){
    if(stageRef.current>=2||flatRef.current)return;
    if(!drag){
     host.style.cursor=screenHit(e.clientX,e.clientY)||keyHit(e.clientX,e.clientY)?'pointer':'grab';
     const hit=raycaster.intersectObject(computer,true)[0]?.object??null;
     ambience.setStickerHover(e.pointerType==='touch'?null:hit,performance.now());return;
    }
    if(drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(Math.hypot(dx,dy)>6)drag.moved=true;
    if(!drag.moved)return;
    yaw=THREE.MathUtils.clamp(drag.yaw-dx*.003,-.30,.30);
    pitch=THREE.MathUtils.clamp(drag.pitch-dy*.002,-.14,.14);
    host.style.cursor='grabbing';dirty=true;
   }
   function pointerUp(e:PointerEvent){
    if(!drag||drag.id!==e.pointerId)return;
    const clicked=!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<=6;
    drag=null;if(host.hasPointerCapture(e.pointerId))host.releasePointerCapture(e.pointerId);host.style.cursor='';
    if(clicked&&stageRef.current<2){const key=keyHit(e.clientX,e.clientY);if(key)pressKey(key);else if(screenHit(e.clientX,e.clientY))enterScreen()}
   }
   function clearStickerHover(){ambience.setStickerHover(null,performance.now())}
   function cancelDrag(){drag=null;host.style.cursor='';clearStickerHover()}
   function wheel(e:WheelEvent){
    if(flatRef.current||e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
    // Keep article and sidebar scrolling native; the bezel and desktop remain zoom targets.
    if(stageRef.current>=2&&e.target instanceof Element){
     for(let node:Element|null=e.target;node&&node!==host;node=node.parentElement){
      if(node instanceof HTMLElement&&node.scrollHeight>node.clientHeight+1&&/auto|scroll/.test(getComputedStyle(node).overflowY)){
       wheelTotal=0;lastWheel=performance.now();return;
      }
     }
    }
    e.preventDefault();
    const now=performance.now(),gap=now-lastWheel,direction=Math.sign(e.deltaY);lastWheel=now;
    // A new gesture is required after zooming, so touchpad inertia cannot bounce back out.
    if(now<wheelLockedUntil){wheelTotal=0;return}
    if(gap>180||direction!==wheelDirection)wheelTotal=0;
    wheelDirection=direction;
    if((stageRef.current<2&&direction>0)||(stageRef.current>=2&&direction<0)){wheelTotal=0;return}
    wheelTotal+=Math.abs(e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?host.clientHeight:1);
    if(wheelTotal<60)return;
    wheelTotal=0;wheelLockedUntil=now+1000;cancelDrag();
    if(stageRef.current<2)enterScreen();else{move(0);host.focus({preventScroll:true})}
   }
   host.addEventListener('pointerdown',pointerDown);host.addEventListener('pointermove',pointerMove);host.addEventListener('pointerup',pointerUp);host.addEventListener('pointercancel',cancelDrag);host.addEventListener('lostpointercapture',cancelDrag);host.addEventListener('wheel',wheel,{passive:false,capture:true});
   host.addEventListener('pointerleave',clearStickerHover);window.addEventListener('blur',clearStickerHover);
   function animate(now:number){frame=requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden||flatRef.current)return;const s=stageRef.current;
    if(ambience.update(now,s<2,reduced.matches,powerOn))dirty=true;
    keys.forEach((key,obj)=>{const t=(now-key.pressedAt)/320;const y=key.rest-(t>=0&&t<1?.055*Math.sin(Math.PI*t):0);if(obj.position.y!==y){obj.position.y=y;dirty=true}});
    const bootOpacity=powerOn&&s<2?1-THREE.MathUtils.smoothstep(now-powerAt,0,reduced.matches?1:650):0;
    if(bootMaterial.opacity!==bootOpacity){bootMaterial.opacity=bootOpacity;dirty=true}bootVeil.visible=bootOpacity>0;
    if(s<2){const k=Math.max(1,1/aspect);focus.set(.65,1.45,.55);offset.set(-7.8,3.45,10.8).sub(focus);orbit.setFromVector3(offset);orbit.theta+=yaw;orbit.phi+=pitch;destination.setFromSpherical(orbit).multiplyScalar(k).add(focus)}else{const distance=Math.max(4.38,4.38/aspect);destination.set(0,3.00,.659+distance);focus.set(0,2.97,.659)}
    if(previousStage!==s){if(s>=2)powerOn=true;screenCovers.forEach(o=>{o.visible=s<2&&!powerOn});previousStage=s;dirty=true}
    if(!dirty&&camera.position.distanceToSquared(destination)<.00000001&&target.distanceToSquared(focus)<.00000001)return;const blend=reduced.matches?1:1-Math.exp(-dt*3.6);camera.position.lerp(destination,blend);target.lerp(focus,blend);camera.lookAt(target);renderer.render(scene,camera);css.render(domScene,camera);
    if(guide.current){guidePoint.set(0,2.97,.8).project(camera);guide.current.style.left=`${(guidePoint.x*.5+.5)*host.clientWidth}px`;guide.current.style.top=`${(-guidePoint.y*.5+.5)*host.clientHeight}px`;guide.current.style.visibility=s<2?'visible':'hidden'}dirty=false;
   }frame=requestAnimationFrame(animate);setReady(true);
   dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();host.removeEventListener('pointerdown',pointerDown);host.removeEventListener('pointermove',pointerMove);host.removeEventListener('pointerup',pointerUp);host.removeEventListener('pointercancel',cancelDrag);host.removeEventListener('lostpointercapture',cancelDrag);host.removeEventListener('wheel',wheel,true);host.removeEventListener('pointerleave',clearStickerHover);window.removeEventListener('blur',clearStickerHover);host.style.cursor='';renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if('map'in m)(m.map as InstanceType<typeof THREE.Texture>|null)?.dispose();m.dispose()})}});renderer.dispose();renderer.domElement.remove();css.domElement.remove();element.remove()};
  }setup().catch(()=>{if(!cancelled)setFailed(true)});return()=>{cancelled=true;dispose()};
 },[]);
 return <div className={'studio stage-'+stage+(flat?' studio-flat':'')}>
  <div className="studio-world" ref={mount} role={stage<2?'button':undefined} tabIndex={stage<2?0:-1} aria-label={stage<2?'Enter Qingyuan’s computer':undefined} onKeyDown={e=>{if(stage<2&&(e.key==='Enter'||e.key===' ')){e.preventDefault();if(innerWidth<700)setFlat(true);else move(2)}}}/>
  {ready&&!failed&&stage<2&&!flat&&<div ref={guide} className="screen-guide" role="img" aria-label="Click the screen to enter"><svg className="screen-guide-cursor" viewBox="0 0 64 80" aria-hidden="true"><path d="M10 5V59L24 46L36 71L47 66L35 41H55Z" fill="currentColor" stroke="#24271b" strokeWidth="3" strokeLinejoin="miter"/></svg></div>}
  {!ready&&!failed&&<p className="studio-loading">Setting up the desk…</p>}{failed&&<div className="studio-error"><p>The 3D studio couldn’t start on this device.</p><button onClick={()=>setFlat(true)}>Open the portfolio</button></div>}
  <div className="flat-desktop" hidden={!flat} role={flat?'dialog':undefined} aria-modal={flat?true:undefined} aria-label="Qingyuan portfolio desktop"><div ref={setFlatTarget} className="flat-desktop-host"/></div>
  {screen?createPortal(<DesktopOS items={items} flat={flat} onExpand={()=>setFlat(!flat)}/>,screen):flat&&flatTarget?createPortal(<DesktopOS items={items} flat onExpand={()=>setFlat(false)}/>,flatTarget):null}
 </div>
}
