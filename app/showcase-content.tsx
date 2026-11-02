import { Mail, GraduationCap } from 'lucide-react';
export type ShowcaseView='about'|'experience'|'research'|'projects';
export function ShowcaseAbout(){return <article className="os-article about-story">
 <h1>About Me</h1>
 <div className="about-introduction">
 <img className="about-avatar" src="/media/about/qingyuan.jpg" alt="Qingyuan Ma" width="853" height="853" decoding="async"/>
 <div className="about-intro-copy"><nav className="about-contact-icons" aria-label="Contact and profiles">
 <a href="mailto:qingyuan0102@gmail.com" aria-label="Email Qingyuan" title="Email"><Mail size={18}/></a>
 <a href="https://github.com/qingyuann" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1.5-.5-2.5-1.5-3.5.3-1 .3-2-.2-3-1.5 0-2.5.7-3.3 1.3a12 12 0 0 0-6 0C8.2 4.2 7.2 3.5 5.7 3.5c-.5 1-.5 2-.2 3C4.5 7.5 4 8.5 4 10c0 4 2 5.5 6 6-.7.5-1 1-1 2v4"/></svg></a>
 <a href="https://www.linkedin.com/in/qingyuan-ma-5789b6265/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="5" r="2"/><path d="M3 9h4v12H3zm7 0h4v1.6c1-2.5 7-3 7 3V21h-4v-6.5c0-3-3-3-3 0V21h-4z"/></svg></a>
 <a href="https://scholar.google.com/citations?hl=en&user=DztWMqkAAAAJ" target="_blank" rel="noreferrer" aria-label="Google Scholar" title="Google Scholar"><GraduationCap size={18}/></a>
 </nav><p className="os-lead">Hi, I’m Qingyuan Ma, a programmer based in Sweden. I work primarily with C++ and C#, using CryEngine, Unreal Engine, and Unity, with experience in real-time graphics and game development.</p></div>
 </div>
 <p>Currently, I’m a game engineer at MindArk, working on <em>Entropia Universe</em>. I develop character customization and facial animation systems, collaborate with artists on model, texture, and shader upgrades, and help build Unreal Engine tools for previewing character assets.</p>
 <p>I completed my master’s in Interactive Technologies at Chalmers University of Technology, with a thesis at EA SEED on 3D Gaussian Splatting for real-time rendering. My research involved implementing rendering features in C++ and GLSL, debugging graphics, and profiling performance.</p>
 <p>Before moving to Sweden, I earned a bachelor’s in Information Systems at Beihang University in China, building my foundation in programming, data structures, and algorithms. I enjoy connecting the technical and visual sides of development — understanding systems, refining what appears on screen, and making it useful to the people interacting with it.</p>
 <details className="about-life">
 <summary>A little more about me in life</summary>
 <p>Away from the keyboard, I enjoy skiing, climbing, and music.</p>
 <div className="about-life-photos">
 <img src="/media/about/skiing.jpg" alt="Qingyuan on a snowy ski slope" width="1279" height="1706" loading="lazy" decoding="async"/>
 <img src="/media/about/climbing.jpg" alt="Qingyuan climbing outdoors" width="1280" height="1792" loading="lazy" decoding="async"/>
 <img src="/media/about/city.jpg" alt="Qingyuan exploring the city" width="1279" height="1706" loading="lazy" decoding="async"/>
 </div>
 </details>
 </article>}
export function ShowcaseSidebar({view,onNavigate}:{view:ShowcaseView;onNavigate:(v:ShowcaseView)=>void}){
 return <aside className="showcase-sidebar"><h2>Qingyuan<br/>Ma</h2><nav aria-label="Showcase navigation">{(['experience','research','projects','about'] as const).map(v=><button key={v} aria-current={view===v?'page':undefined} onClick={()=>onNavigate(v)}>{v==='experience'?'WORK EXPERIENCE':v==='research'?'RESEARCH EXPERIENCE':v.toUpperCase()}</button>)}</nav></aside>
}
export function ShowcaseExperience(){
 const jobs=[
 {id:'character',company:'MindArk',role:'Game Engineer',dates:'Aug 2025 – Present',tools:'C++ · Customized CryEngine · Unreal Engine',intro:<>Developing character systems and artist tools for <a className="experience-game-link" href="https://www.entropiauniverse.com/" target="_blank" rel="noreferrer"><strong>Entropia Universe</strong></a>, with work spanning avatar customization, rendering, animation, and the transition to Unreal Engine.</>,points:[
 <><strong>Character customization and rendering:</strong> Developed and debugged the character creator from prototype to a shippable state, supporting 100+ color, morph, and skeletal parameters, reliable character data persistence, and creator-to-world transitions. Collaborated with a cross-functional team to upgrade avatar textures, character models, and shaders. <a className="experience-game-link" href="https://www.youtube.com/watch?v=txgYEk18KfU&t=4s" target="_blank" rel="noreferrer">Release Video ↗</a></>,
 <><strong>LLM Avatar Stylist:</strong> Delivered real-time avatar customization using multimodal inputs (text/image/voice), integrating low-latency inference services into a live client-server architecture for high-concurrency MMO workloads.</>,
 <><strong>Facial animation:</strong> Implemented a custom facial animation system that imports blend-shape animations from FBX files and converts them into facial animation sequences driven by CryEngine morph targets.</>,
 <><strong>Unreal Engine tools:</strong> Helped build Character Lab as part of the migration from CryEngine to Unreal Engine, providing artists with an editor tool to preview character models, textures, and the full armor and garment library.</>]},
 {id:'splat',company:'Electronic Arts — SEED',role:'Master’s Thesis Intern, Future Graphics Team',dates:'Jan – Jun 2025',tools:'C++ · GLSL · RenderDoc · Nsight',intro:<>Researched <strong>3D Gaussian Splatting for real-time texturing</strong>, exploring how Gaussian-based textures could extend traditional texture mapping.</>,points:[
 <>Implemented a real-time texture mapping pipeline and interactive texture-blending controls and gizmos.</>,
 <>Developed mipmap generation and runtime level-of-detail selection to support rendering at different viewing distances.</>,
 <>Used RenderDoc and Nsight for frame debugging and performance profiling.</>]},
 {id:'volvo',company:'Volvo Group',role:'Software Engineering Intern',dates:'Jun – Dec 2024',tools:'LLMs · Android Test Automation · Vector Databases',intro:<>Contributed to an AI-assisted Android testing system covering test code generation, execution, debugging, and reporting.</>,points:[
 <>Explored how LLMs could support engineers in writing and maintaining software tests.</>,
 <>Used UI navigation graphs and stored navigation information in vector databases to provide application-specific context for test generation.</>]},
 {id:'vr',company:'Tsinghua Art & Science Center',role:'VR Developer Intern',dates:'Jun – Oct 2021',tools:'Unity · Virtual Reality',intro:<>Contributed to an immersive VR experience exploring how artificial intelligence could shape future cities.</>,points:[
 <>Implemented interactive objects and scenes in Unity and helped the team deploy the final experience.</>,
 <>The project was showcased at the Beijing International Design Festival and the “Guokr Museum” exhibition.</>]}
 ];
 return <div className="showcase-experience"><h1 className="experience-heading">Work Experience</h1>{jobs.map(e=>{return <article className="showcase-job" key={e.id}><h2 className="experience-company">{e.company}</h2><div className="experience-role">{e.role}<span> · {e.dates}</span></div><p className="experience-tools"><em>{e.tools}</em></p><ul>{e.points.map((point,i)=><li key={i}>{point}</li>)}</ul></article>})}</div>
}

export function ShowcaseResearch(){
 const papers=[
 {title:'EmoWear: Exploring Emotional Teasers for Voice Message Interaction on Smartwatches',venue:'ACM CHI · 2024',authors:'Pengcheng An, Jiawen Zhu, Zibo Zhang, Yifei Yin, Qingyuan Ma, Che Yan, Linghao Du, Jian Zhao',topic:'Human–Computer Interaction · Multimodal Emotion Recognition',description:'A smartwatch messaging system that uses animated message bubbles to convey emotion before a voice message is played. Semantic and acoustic analysis help users choose expressive animations.',url:'https://doi.org/10.1145/3613904.3642101'},
 {title:'Prototyping An Interactive Ambient Plant for Meditation',venue:'ACM AVI · 2024',authors:'Diana Boskovic, Isabelle Ermeryd Tankred, Qingyuan Ma, Alexander Can Zois, Sjoerd Hendriks, Mohammad Obaid',topic:'Interaction Design · Physical Prototyping · Meditation',description:'ZenStem is an interactive plant prototype that connects meditation with plant care. Heart-rate feedback and a light-based breathing guide support a meditative state, linking personal well-being to watering a living plant.',url:'https://doi.org/10.1145/3656650.3656722'},
 {title:'Renewable energy quality trilemma and coincident wind and solar droughts',venue:'Communications Earth & Environment · 2024',authors:'Mingquan Li, Qingyuan Ma, Rui Shan, Ahmed Abdulla, Edgar Virguez, Shuo Gao, Dalia Patiño-Echeverri',topic:'Renewable Energy · Data Analysis',description:'A study of wind and solar resource quality across availability, variability, and extremeness. The research examines coincident renewable energy droughts and the trade-offs involved in planning reliable renewable energy systems.',url:'https://doi.org/10.1038/s43247-024-01850-5'}
 ];
 return <div className="showcase-experience"><h1 className="experience-heading">Research Experience</h1>{papers.map(p=><article className="showcase-job" key={p.url}><h2 className="experience-company">{p.title}</h2><p className="research-authors">{p.authors}</p><div className="experience-role">{p.venue}</div><p>{p.description}</p><a className="showcase-text-link" href={p.url} target="_blank" rel="noreferrer">View Paper ↗</a></article>)}</div>
}
