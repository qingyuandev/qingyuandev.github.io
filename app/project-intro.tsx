'use client';
import { useState } from 'react';
type IntroProject={id:string;title:string;image:string;alt:string;context:string;outcome:string;video?:string;youtube?:string};
const captions:Record<string,string>={character:'Legacy character on the left; updated character on the right. Entropia Universe.',splat:'A woven surface represented with Gaussian splatting textures. Demo excerpt from the thesis.',pixel:'PixelForge: a world made of interacting, simulated pixel materials. Demo excerpt.',avatar:'Character appearance in the avatar customization interface.',fluid:'Real-time water simulation with a floating sphere and caustic lighting.',alice:'Alice: Through the Frame — a playable adventure between 3D environments and 2D paintings.',emowear:'EmoWear system overview: speech and text analysis support animation recommendations.',volvo:'Workflow diagram based on my CV; this is not a product screenshot.',vr:'Project workflow diagram based on my CV; original exhibition imagery is not yet available.',hospital:'The hospital information system home page.'};
export default function ProjectIntro({project:p}:{project:IntroProject}){
 const [watching,setWatching]=useState(false);
 return <section className={'case-intro '+(['avatar','pixel'].includes(p.id)?'case-intro-wrap':'')}>
  <h2>{p.outcome}</h2><p>{p.context}</p>
  <figure className="case-figure case-main-figure">
   {watching&&p.youtube?<iframe title={p.title+' video'} src="https://www.youtube-nocookie.com/embed/txgYEk18KfU?start=3" allow="encrypted-media; picture-in-picture" allowFullScreen/>:p.video?<video controls playsInline preload="none" poster={'/media/'+p.image} src={'/media/'+p.video} aria-label={p.title+' demonstration'}/>:<a href={'/media/'+p.image} target="_blank" rel="noreferrer" aria-label={'Open full-size image: '+p.alt}><img src={'/media/'+p.image} alt={p.alt}/></a>}
   <figcaption><b>Figure 1.</b> {captions[p.id]??p.alt}</figcaption>
  </figure>
  {p.youtube&&<p className="case-video-links"><button onClick={()=>setWatching(!watching)}>{watching?'View comparison image':'Watch the character update ↗'}</button><a href={p.youtube} target="_blank" rel="noreferrer">YouTube ↗</a></p>}
 </section>
}
