'use client';
import { useEffect, useState, type CSSProperties } from 'react';
function Face() {
  return <g className="cat-face">
    <path fill="currentColor" d="M48 56 46 26 66 39Q80 34 94 39L114 26 112 57Q119 88 80 91 41 88 48 56Z"/>
    <path fill="#c98da5" d="m51 36 3 17 10-10zm57 0-3 17-10-10z"/>
    <g className="cat-eyes" fill="#f8ebbd"><ellipse cx="65" cy="63" rx="4" ry="5"/><ellipse cx="95" cy="63" rx="4" ry="5"/></g>
    <path d="m77 73 3 3 3-3M80 76v4m0 0-5 2m5-2 5 2" fill="none" stroke="#d9acbd" strokeWidth="2" strokeLinecap="round"/>
  </g>;
}

export function CatIcon() {
  return <svg className="os-cat-icon" viewBox="35 22 90 75" aria-hidden="true"><Face/></svg>;
}

export default function DesktopCat() {
  const [lying,setLying]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [look,setLook]=useState({x:0,y:0});
  useEffect(()=>{
    if(hovered||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const timer=window.setInterval(()=>setLying(v=>!v),10000);
    return ()=>window.clearInterval(timer);
  },[hovered,lying]);
  return <button className={'desktop-cat-button '+(lying?'is-lying':'is-sitting')}
    aria-label={lying?'Pet the cat: sit up':'Pet the cat: lie down'} aria-pressed={lying}
    onClick={()=>setLying(v=>!v)} onPointerEnter={()=>setHovered(true)}
    onPointerLeave={()=>{setHovered(false);setLook({x:0,y:0})}}
    onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setLook({x:(e.clientX-r.left)/r.width*6-3,y:(e.clientY-r.top)/r.height*4-3})}}
    style={{'--cat-look-x':`${look.x}px`,'--cat-look-y':`${look.y}px`} as CSSProperties}>
    <svg className="desktop-cat" viewBox="0 0 200 170" aria-hidden="true">
    <ellipse cx="100" cy="150" rx="66" ry="7" fill="currentColor" opacity=".1"/>
    <g className="cat-sitting">
      <path className="cat-tail" d="M109 139Q161 150 156 116Q153 101 143 111" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round"/>
      <path d="M62 80Q45 104 48 143Q79 155 113 143 115 108 98 80Z" fill="currentColor"/>
      <path d="m68 113-2 31m27-31 2 31" stroke="#6f5d69" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <Face/>
    </g>
    <g className="cat-lying">
      <path d="M137 140Q185 146 176 122" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      <ellipse cx="113" cy="130" rx="49" ry="22" fill="currentColor"/>
      <g transform="translate(-15 68) scale(.9)"><Face/></g>
      <path d="M48 146h30m36 0h21" stroke="#6f5d69" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </svg></button>;
}
