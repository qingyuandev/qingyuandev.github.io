'use client';
import ProjectStory from './project-story';
import SelectedProjects from './selected-projects';
import { ShowcaseSidebar, ShowcaseResearch, ShowcaseExperience, ShowcaseAbout, type ShowcaseView } from './showcase-content';
import ProjectIntro from './project-intro';
import { useRef, useState } from 'react';

export type DesktopProject = {id:string;title:string;image:string;alt:string;company:string;summary:string;role:string;outcome:string;context:string;contributions:string[];tags:string[];gallery?:{src:string;caption:string}[];video?:string;youtube?:string;links?:{label:string;url:string}[];note?:string};
type View=ShowcaseView;

export default function DesktopOS({items,onExpand,flat=false}:{items:DesktopProject[];onExpand:()=>void;flat?:boolean}) {
 const [view,setView]=useState<View>('about'),[selected,setSelected]=useState<DesktopProject|null>(null),[minimized,setMinimized]=useState(false),[maximized,setMaximized]=useState(false),[pos,setPos]=useState({x:0,y:0}),[watching,setWatching]=useState(false);
 const content=useRef<HTMLDivElement>(null),drag=useRef<{x:number;y:number;px:number;py:number;scale:number}|null>(null);
 function go(next:View){setView(next);setSelected(null);setWatching(false);setMinimized(false);content.current?.scrollTo(0,0)}
 function choose(p:DesktopProject){setSelected(p);setWatching(false);content.current?.scrollTo(0,0)}
 return <div className={'qos '+(flat?'qos-flat':'qos-crt')}>
  <div className="os-wallpaper"><span>Qingyuan</span><i>Made to be played.</i><b>✳</b></div>
  <div className="os-shortcuts">{([{id:'projects',icon:'▣',title:'My projects'},{id:'experience',icon:'▤',title:'Work Experience'},{id:'about',icon:'✳',title:'About me'}] as const).map(s=><button key={s.id} onClick={()=>go(s.id)}><span className={'os-icon icon-'+s.id}>{s.icon}</span>{s.title}</button>)}</div>
  {!minimized&&<section className={'os-window '+(maximized?'os-maximized':'')} style={!maximized?{transform:`translate(${pos.x}px,${pos.y}px)`}:undefined} aria-label="Portfolio explorer">
   <div className="os-title" onPointerDown={e=>{if(maximized||flat||(e.target as HTMLElement).closest('button'))return;const rect=e.currentTarget.getBoundingClientRect();drag.current={x:e.clientX,y:e.clientY,px:pos.x,py:pos.y,scale:rect.width/e.currentTarget.offsetWidth};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{const d=drag.current;if(!d)return;setPos({x:Math.max(-90,Math.min(80,d.px+(e.clientX-d.x)/d.scale)),y:Math.max(-30,Math.min(55,d.py+(e.clientY-d.y)/d.scale))})}} onPointerUp={()=>{drag.current=null}} onLostPointerCapture={()=>{drag.current=null}}>
    <span>▣ &nbsp; {selected?selected.title:'My portfolio'} — Qingyuan OS</span><div><button onClick={()=>setMinimized(true)} aria-label="Minimize portfolio">_</button><button onClick={()=>{setMaximized(!maximized);setPos({x:0,y:0})}} aria-label={maximized?'Restore window':'Maximize window'}>□</button><button onClick={()=>setMinimized(true)} aria-label="Close portfolio">×</button></div>
   </div>
   <div className="os-menu"><button onClick={()=>go('projects')}>Projects</button><button onClick={()=>go('experience')}>Work Experience</button><button onClick={()=>go('about')}>About</button><button className="os-expand" onClick={onExpand}>{flat?'Return to studio ↙':'Expand to read ↗'}</button></div>
   <div className="os-address"><button onClick={()=>{setSelected(null);setWatching(false);content.current?.scrollTo(0,0)}} disabled={!selected} aria-label="Back to project list">←</button><span>C:\Qingyuan\{view}{selected?String.fromCharCode(92)+selected.id:''}</span></div>
   <div className="os-explorer"><ShowcaseSidebar view={view} onNavigate={go}/><div className="os-content" ref={content}>
    {selected?<article className="os-article"><span className="os-eyebrow">{selected.company}</span><h1>{selected.title}</h1><p className="os-lead">{selected.summary}</p><p className="os-role">{selected.role}</p><ProjectIntro key={selected.id} project={selected}/><h2>My contribution</h2><ProjectStory project={selected}/>{selected.links?.map(l=><a className="os-source" key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}{selected.note&&<p className="os-note">{selected.note}</p>}<button className="os-button" onClick={()=>{setSelected(null);setWatching(false);content.current?.scrollTo(0,0)}}>← Back to projects</button></article>
    :view==='projects'?<SelectedProjects/>
    :view==='experience'?<ShowcaseExperience/>:view==='research'?<ShowcaseResearch/>:<ShowcaseAbout/>}
   </div></div><div className="os-window-status"><span>{selected?'Project case study':view==='projects'?'5 selected projects':view==='experience'?'Work experience':'Qingyuan Ma'}</span><span>Q / 01</span></div>
  </section>}
  <div className="os-taskbar"><button onClick={()=>go('projects')}><b className="os-start-star">✳</b> Start</button><button className={!minimized?'os-task-selected':''} onClick={()=>setMinimized(!minimized)}>▣ My portfolio</button><a href="mailto:qingyuan0102@gmail.com" aria-label="Email Qingyuan">✉</a><span>Qingyuan OS</span></div>
 </div>
}
