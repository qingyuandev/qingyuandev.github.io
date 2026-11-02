function Face() {
  return <g>
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
  return <svg className="desktop-cat" viewBox="0 0 200 170" role="img" aria-label="A little cat sitting, lying down and rolling">
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
    <g className="cat-rolling">
      <ellipse cx="100" cy="107" rx="29" ry="37" fill="currentColor"/>
      <ellipse cx="100" cy="109" rx="14" ry="23" fill="#66545f"/>
      <path d="M83 132Q48 146 50 118M75 98l-9-12m59 12 9-12" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
      <g transform="translate(28 8) scale(.9)"><Face/></g>
    </g>
  </svg>;
}
