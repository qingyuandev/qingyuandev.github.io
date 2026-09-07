'use client';
import { useEffect, useRef, useState } from 'react';
type Item={id:string;title:string;image:string};
export default function RetroDesktop({items,onOpen}:{items:Item[];onOpen:(id:string)=>void}) {
 const mount=useRef<HTMLDivElement>(null), openRef=useRef(onOpen), pauseRef=useRef(false);
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[paused,setPaused]=useState(false);
 openRef.current=onOpen;
 useEffect(()=>{pauseRef.current=paused},[paused]);
 useEffect(()=>{
  let dispose=()=>{},cancelled=false;
  async function create(){
   const THREE=await import('three');
   const {RoundedBoxGeometry}=await import('three/addons/geometries/RoundedBoxGeometry.js');
   const {OutlineEffect}=await import('three/addons/effects/OutlineEffect.js');
   if(cancelled||!mount.current)return;
   const host=mount.current,renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;renderer.toneMappingExposure=1;
   host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
   const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-7,7,4,-4,.1,70);camera.position.set(3.8,2.8,11);camera.lookAt(.3,.5,0);
   const outline=new OutlineEffect(renderer,{defaultThickness:.0012,defaultColor:[.16,.145,.11],defaultAlpha:1});
   scene.add(new THREE.HemisphereLight(0xfff9e9,0xaaa58b,.8));
   const key=new THREE.DirectionalLight(0xffffff,2.05);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;key.shadow.normalBias=.04;scene.add(key);
   
   const computer=new THREE.Group();computer.rotation.y=-.13;computer.scale.setScalar(1.4);computer.position.set(-.3,.05,0);scene.add(computer);
   const ramp=new THREE.DataTexture(new Uint8Array([150,205,250]),3,1,THREE.RedFormat);ramp.minFilter=THREE.NearestFilter;ramp.magFilter=THREE.NearestFilter;ramp.generateMipmaps=false;ramp.needsUpdate=true;
   const ivory=new THREE.MeshToonMaterial({color:0xe4e0c9,gradientMap:ramp}),dark=new THREE.MeshToonMaterial({color:0x666653,gradientMap:ramp}),beige=new THREE.MeshToonMaterial({color:0xbcbba4,gradientMap:ramp}),purple=new THREE.MeshToonMaterial({color:0xebce4f,gradientMap:ramp});
   ivory.userData.outlineParameters={thickness:.0012};beige.userData.outlineParameters={thickness:.0007};dark.userData.outlineParameters={thickness:.0007};purple.userData.outlineParameters={thickness:.0007};

   function box(w:number,h:number,d:number,x:number,y:number,z:number,mat=ivory,r=.04,parent=computer){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,r),mat);m.position.set(x,y,z);m.castShadow=parent===computer;m.receiveShadow=parent===computer;parent.add(m);return m}
   // The monitor is actual 3D geometry, with a recessed screen and a deep CRT case.
   box(2.5,2.03,1.55,-.25,.7,-.27,ivory,.13);box(2.55,2.04,.26,-.25,.7,.54,ivory,.12);
   box(2.16,1.6,.1,-.25,.79,.695,beige,.09);box(2.02,1.47,.08,-.25,.79,.751,dark,.08);
   box(.34,.4,.5,-.25,-.48,-.1,beige,.05);box(1.5,.17,1.05,-.25,-.74,-.07,ivory,.07);
   function canvasTexture(w:number,h:number,paint:(c:CanvasRenderingContext2D)=>void){const el=document.createElement('canvas');el.width=w;el.height=h;const c=el.getContext('2d')!;paint(c);const texture=new THREE.CanvasTexture(el);texture.colorSpace=THREE.SRGBColorSpace;return texture}
   const screenTexture=canvasTexture(1024,768,c=>{c.fillStyle='#f3a0c6';c.fillRect(0,0,1024,768);const grad=c.createLinearGradient(0,0,1024,650);grad.addColorStop(0,'#f09bc2');grad.addColorStop(1,'#f09bc2');c.fillStyle=grad;c.fillRect(0,0,1024,714);
    const win=(x:number,y:number,w:number,h:number,title:string)=>{c.fillStyle='#161b44';c.fillRect(x+9,y+10,w,h);c.fillStyle='#e4dfc4';c.fillRect(x,y,w,h);c.strokeStyle='#fff';c.lineWidth=4;c.strokeRect(x+2,y+2,w-4,h-4);c.fillStyle='#b52e73';c.fillRect(x+7,y+7,w-14,37);c.fillStyle='white';c.font='bold 24px monospace';c.fillText(title,x+18,y+33);c.fillStyle='#e4dfc4';c.fillRect(x+w-36,y+13,23,23);c.fillStyle='#121321';c.fillText('×',x+w-33,y+32)};
    win(155,178,734,385,'C:\\QINGYUAN\\WELCOME.exe');c.fillStyle='#f6b6d3';c.fillRect(169,226,706,320);c.fillStyle='#aa2163';c.font='bold 62px monospace';c.fillText('Hello, world!',200,320);c.font='31px monospace';c.fillText("I'm Qingyuan Ma.",202,380);c.font='24px monospace';c.fillStyle='#98375e';c.fillText('GAME DEVELOPER + GRAPHICS',202,427);c.fillStyle='#ecdb64';c.fillRect(201,462,290,55);c.strokeStyle='#626657';c.lineWidth=2;c.strokeRect(201,462,290,55);c.fillStyle='#242839';c.font='bold 24px monospace';c.fillText('Explore my work >',214,498);
    c.fillStyle='#e5d997';c.fillRect(44,48,49,38);c.fillRect(44,39,25,12);c.fillStyle='white';c.font='21px monospace';c.fillText('Projects',25,118);c.fillStyle='#c4c6d0';c.fillRect(0,714,1024,54);c.fillStyle='#fff';c.fillRect(0,714,1024,3);c.fillStyle='#d4d5da';c.fillRect(7,723,127,36);c.strokeStyle='#6d6b74';c.strokeRect(7,723,127,36);c.fillStyle='#aa2163';c.font='bold 25px monospace';c.fillText('✳ Start',17,750);c.font='22px monospace';c.fillText('portfolio.exe',176,748);c.fillText('09:07',918,748);
    c.fillStyle='#071a3510';for(let y=0;y<768;y+=4)c.fillRect(0,y,1024,1);
   });
   const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.94,1.4),new THREE.MeshBasicMaterial({map:screenTexture,toneMapped:false}));screen.position.set(-.25,.79,.799);computer.add(screen);
   box(.17,.07,.035,.73,-.136,.704,beige,.015);const led=new THREE.Mesh(new THREE.SphereGeometry(.025,10,8),new THREE.MeshBasicMaterial({color:0xe8d354}));led.position.set(.59,-.135,.72);computer.add(led);
   const badgeTexture=canvasTexture(512,80,c=>{c.fillStyle='#65676a';c.font='bold 32px monospace';c.fillText('QINGYUAN 98',10,53)});const badge=new THREE.Mesh(new THREE.PlaneGeometry(.65,.1),new THREE.MeshBasicMaterial({map:badgeTexture,transparent:true}));badge.position.set(-.79,-.12,.71);computer.add(badge);
   // Horizontal system unit under the CRT, matching the supplied illustration.
   box(2.76,.46,1.75,-.25,-1.035,.02,ivory,.025);
   box(.56,.07,.035,.5,-1.085,.919,beige,.008);
   box(.54,.024,.019,.5,-1.075,.944,dark,.004);
   box(.09,.05,.04,-1.37,-1.084,.934,purple,.008);
   for(let i=0;i<5;i++)box(.014,.028,.54,1.138,-.905-i*.055,-.03,beige,.004);
   for(let i=0;i<5;i++)box(.018,.021,.59,1.015,.86-i*.12,-.39,beige,.004);
   // Keyboard and mouse sit in front of the monitor.
   const keyboard=new THREE.Group();keyboard.position.set(-.45,-1.48,1.64);keyboard.rotation.x=.07;computer.add(keyboard);box(2.5,.18,.86,0,0,0,ivory,.05,keyboard);
   for(let row=0;row<4;row++)for(let col=0;col<13;col++)box(.15,.075,.14,-1.09+col*.18,.12,-.3+row*.17,(row===0&&col===0)?purple:beige,.017,keyboard);
   box(.91,.075,.12,-.1,.12,.36,beige,.016,keyboard);
   const mouse=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),ivory);mouse.scale.set(.24,.12,.35);mouse.position.set(1.42,-1.49,1.74);mouse.castShadow=true;computer.add(mouse);box(.017,.035,.16,1.42,-1.372,1.62,beige,.004);
   const cableCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(1.42,-1.5,1.4),new THREE.Vector3(2.05,-1.42,.95),new THREE.Vector3(1.65,-1.34,.2),new THREE.Vector3(1.12,-1.1,-.6)]);computer.add(new THREE.Mesh(new THREE.TubeGeometry(cableCurve,28,.018,6,false),beige));
   const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.21,color:0x003f36}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.43;ground.receiveShadow=true;ground.visible=false;scene.add(ground);
   const cards:{group:InstanceType<typeof THREE.Group>;hit:InstanceType<typeof THREE.Mesh>;id:string;phase:number}[]=[];const loader=new THREE.TextureLoader();
   items.forEach((item,i)=>{const group=new THREE.Group();scene.add(group);box(2.13,1.5,.055,0,0,0,ivory,.015,group);
    const barTex=canvasTexture(640,70,c=>{c.fillStyle=i%2?'#c64083':'#a7306c';c.fillRect(0,0,640,70);c.fillStyle='#fff';c.font='bold 24px monospace';c.fillText(item.title.slice(0,29),18,45);c.fillStyle='#d4d4db';c.fillRect(581,12,45,43);c.fillStyle='#27264a';c.font='32px monospace';c.fillText('×',589,44)});
    const bar=new THREE.Mesh(new THREE.PlaneGeometry(2.03,.22),new THREE.MeshBasicMaterial({map:barTex,toneMapped:false}));bar.position.set(0,.605,.04);group.add(bar);
    const mat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});const face=new THREE.Mesh(new THREE.PlaneGeometry(2.03,1.16),mat);face.position.set(0,-.105,.042);face.userData.projectId=item.id;group.add(face);
    loader.load('/media/'+item.image,tex=>{if(cancelled){tex.dispose();return}tex.colorSpace=THREE.SRGBColorSpace;const ar=tex.image.width/tex.image.height;const target=2.03/1.16;if(ar>target){tex.repeat.x=target/ar;tex.offset.x=(1-tex.repeat.x)/2}else{tex.repeat.y=ar/target;tex.offset.y=(1-tex.repeat.y)/2}mat.map=tex;mat.needsUpdate=true});
    cards.push({group,hit:face,id:item.id,phase:i/items.length*Math.PI*2+.3});
   });
   scene.traverse(obj=>{if(obj instanceof THREE.Mesh){const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>{if(!(m instanceof THREE.MeshToonMaterial))m.userData.outlineParameters={visible:false}})}});
   const pointer=new THREE.Vector2(99,99),raycaster=new THREE.Raycaster();let offset=0,drag=false,lastX=0,moved=0,hover='',frame=0,visible=true,previous=0,time=0;
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches){pauseRef.current=true;setPaused(true)}
   function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);const aspect=w/h;const viewHeight=w<650?12.8:Math.max(7.3,12.5/aspect);camera.left=-viewHeight*aspect/2;camera.right=viewHeight*aspect/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;camera.updateProjectionMatrix();computer.scale.setScalar(w<650?1.05:1.4)}
   const ro=new ResizeObserver(resize);ro.observe(host);resize();
   const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{threshold:0});observer.observe(host);
   function point(e:PointerEvent){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1)}
   const move=(e:PointerEvent)=>{point(e);if(drag){offset+=(e.clientX-lastX)*.006;moved+=Math.abs(e.clientX-lastX);lastX=e.clientX}};
   const down=(e:PointerEvent)=>{drag=true;lastX=e.clientX;moved=0;point(e);renderer.domElement.setPointerCapture(e.pointerId)};
   const up=(e:PointerEvent)=>{drag=false;point(e);if(moved<8){raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(cards.map(c=>c.hit))[0];if(hit)openRef.current(hit.object.userData.projectId)}if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId)};
   const leave=()=>{pointer.set(99,99);hover=''};
   const keys=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();offset+=e.key==='ArrowLeft'?-.18:.18}};
   renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);renderer.domElement.addEventListener('pointerleave',leave);host.addEventListener('keydown',keys);
   const lost=(e:Event)=>{e.preventDefault();setFailed(true)};renderer.domElement.addEventListener('webglcontextlost',lost);
   function animate(now:number){frame=requestAnimationFrame(animate);const dt=Math.min((now-previous)/1000,.04);previous=now;if(!visible||document.hidden)return;
    if(!pauseRef.current&&!drag&&!hover)time+=dt*.065;
    cards.forEach((card,i)=>{const angle=card.phase+time+offset;card.group.position.set(Math.cos(angle)*4.45,Math.sin(angle)*2.1+1,Math.sin(angle+.6)*2.15-.8);card.group.quaternion.copy(camera.quaternion);card.group.rotateZ(Math.sin(angle)*.045);const target=hover===card.id?1.07:1;card.group.scale.lerp(new THREE.Vector3(target,target,target),.12);if(!pauseRef.current)card.group.position.y+=Math.sin(now*.0006+i)*.08});
    raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(cards.map(c=>c.hit))[0];hover=hit?.object.userData.projectId||'';renderer.domElement.style.cursor=drag?'grabbing':hover?'pointer':'grab';outline.render(scene,camera);
   }frame=requestAnimationFrame(animate);setReady(true);
   dispose=()=>{cancelAnimationFrame(frame);ro.disconnect();observer.disconnect();host.removeEventListener('keydown',keys);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointercancel',up);renderer.domElement.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>{if('map'in m)(m.map as InstanceType<typeof THREE.Texture>|null)?.dispose();m.dispose()})}});ramp.dispose();renderer.dispose();renderer.domElement.remove()};
  }
  create().catch(()=>{if(!cancelled)setFailed(true)});
  return()=>{cancelled=true;dispose()};
 },[items]);
 return <div className="retro-scene"><div className="scene-canvas" ref={mount} tabIndex={0} role="group" aria-label="Interactive retro desktop. Drag horizontally or use arrow keys to rotate project windows. Use the project buttons below to open details."/>{!ready&&!failed&&<div className="scene-loading"><span>Starting Qingyuan OS…</span><div className="boot-track"/></div>}{failed&&<div className="scene-fallback"><h2>Welcome to my desktop.</h2><p>Explore the projects below.</p></div>}<div className="scene-toolbar"><span>DRAG TO ORBIT · CLICK A PROJECT</span><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'▶ Resume motion':'Ⅱ Pause motion'}</button></div><div className="scene-projects" aria-label="Open a featured project">{items.map(p=><button key={p.id} onClick={()=>onOpen(p.id)}><span aria-hidden="true">▧</span>{p.title.replace('.exe','')}</button>)}</div></div>;
}

