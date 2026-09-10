'use client';
import Image from 'next/image';
import {Fragment,useMemo,useState} from 'react';
import type {AgendaDay,AgendaModule,AgendaSession,AgendaPerson} from '../lib/agenda';

type Props={days:AgendaDay[]};

const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const fallbackPhoto=(name:string)=>`/images/speakers/expo/${slug(name)}.jpg`;

// Static display dates for the two agenda days — update here if dates change.
const dayDates:Record<string,string>={day1:'19 November 2026',day2:'20 November 2026'};

function PersonCard({p}:{p:AgendaPerson}){
 const [broken,setBroken]=useState(false);
const img=!broken&&p.photo_url;
 return <div className="agenda-person-card">{img?<img src={img} alt={p.name} width={76} height={76} className="agenda-person-photo" onError={()=>setBroken(true)}/>:<div className="agenda-person-initials">{p.name.split(' ').slice(0,2).map((x:string)=>x[0]).join('')}</div>}<div className="agenda-person-copy"><strong>{p.name}</strong>{p.title&&<span>{p.title}</span>}{p.company&&<b>{p.company}</b>}</div></div>
}

function Session({s}:{s:AgendaSession}){
 const [open,setOpen]=useState(false);
 const moderators=s.panelists.filter(p=>String(p.role||'').toLowerCase()==='moderator');
 const panelists=s.panelists.filter(p=>String(p.role||'').toLowerCase()!=='moderator');
 return <div className={`agenda-session agenda-session-${s.type}`}>
  <div className="agenda-session-time">{s.time}</div>
  <div className="agenda-session-main">
   <div className="agenda-session-tag">{s.typeLabel}</div>
   <h4>{s.title}</h4>
{s.discussionPoints&&<button type="button" className="discussion-toggle" onClick={()=>setOpen(!open)}>{open?'Hide':'View'} discussion points <span>{open?'−':'+'}</span></button>}
{open&&s.discussionPoints&&<ul className="discussion-points">{s.discussionPoints.map((pt,i)=><li key={i}>{pt}</li>)}</ul>}
   {s.speakers.length>0&&<div className="agenda-single-speakers">{s.speakers.map(p=><PersonCard key={p.id} p={p}/>)}</div>}
   {moderators.length>0&&<div className="agenda-role-group"><p>Moderator</p>{moderators.map(p=><PersonCard key={p.id} p={p}/>)}</div>}
   {panelists.length>0&&<div className="agenda-role-group"><p>Panelists</p><div className="agenda-panel-grid">{panelists.map(p=><PersonCard key={p.id} p={p}/>)}</div></div>}
  </div>
 </div>
}

function SponsorLogo({name,logo}:{name:string;logo?:string}){
 const [broken,setBroken]=useState(false);
 if(!logo||broken) return null;
 return <div className="agenda-module-partner"><small>Module Partner</small><div className="agenda-sponsor-logo"><img src={logo} alt={name} width={180} height={64} onError={()=>setBroken(true)}/></div></div>;
}

function Module({m}:{m:AgendaModule}){
 return <article className="agenda-module-card">
  <div className="agenda-module-head">
   <div><span>Thematic Module</span><h3>{m.title}</h3></div>
   {m.sponsor&&<SponsorLogo name={m.sponsor.name} logo={m.sponsor.logo}/>}
  </div>
  {m.sessions.map((s)=><Session key={s.agenda_id} s={s}/>)}
 </article>
}

export default function AgendaClient({days}:Props){
 const [dayId,setDayId]=useState(days[0]?.id||'day1');
 const day=useMemo(()=>days.find(d=>d.id===dayId)||days[0],[days,dayId]);
 const [stageId,setStageId]=useState(day?.stages[0]?.id||'main');
 const activeStage=day?.stages.find(s=>s.id===stageId)||day?.stages[0];

 function chooseDay(id:string){const d=days.find(x=>x.id===id);if(!d)return;setDayId(id);setStageId(d.stages[0]?.id||'main')}

 if(!day) return null;

 return <div className="agenda-explorer">
  <div className="agenda-nav-wrap">
   <div className="agenda-day-tabs">{days.map(d=><button key={d.id} className={dayId===d.id?'active':''} onClick={()=>chooseDay(d.id)}><span>{d.label}</span><small>{dayDates[d.id]||''}</small></button>)}</div>
   <div className="agenda-stage-tabs">{day.stages.map(s=><button key={s.id} className={activeStage?.id===s.id?'active':''} onClick={()=>setStageId(s.id)}>{s.label}</button>)}</div>
  </div>
  <div className="agenda-stage-content" key={`${dayId}-${activeStage?.id}`}>
   <div className="agenda-stage-heading"><span>{day.label} · {dayDates[day.id]||''}</span><h2>{activeStage?.label}</h2></div>
   {activeStage?.opening?.map((o)=>(
    <div key={o.time} className="agenda-break opening">
     <strong>{o.time}</strong>
     <span>{o.title}</span>
    </div>
   ))}
{activeStage?.modules.map(m=>(
 <Fragment key={m.module_id}>
  <Module m={m}/>
  {m.after?.map(o=>(
   <div key={o.time} className="agenda-break">
    <strong>{o.time}</strong>
    <span>{o.title}</span>
   </div>
  ))}
 </Fragment>
))}
  </div>
 </div>
}