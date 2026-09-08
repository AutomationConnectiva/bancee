'use client';
import Image from 'next/image';
import {useMemo,useState} from 'react';
import type {AgendaDay,AgendaModule,AgendaSession} from '../lib/agenda';

type Props={days:AgendaDay[]};
const sponsorMap:Record<string,string>={Authologic:'/images/agenda/sponsors/authologic.png',Evrotrust:'/images/agenda/sponsors/evrotrust.png',ERI:'/images/agenda/sponsors/eri.png','Tieto Banktech':'/images/agenda/sponsors/tieto.png',Guardsquare:'/images/agenda/sponsors/guardsquare.png'};
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const fallbackPhoto=(name:string)=>`/images/speakers/expo/${slug(name)}.jpg`;

function PersonCard({p}:{p:any}){
 const [broken,setBroken]=useState(false); const img=!broken&&(p.photo_url||fallbackPhoto(p.name));
 return <div className="agenda-person-card">{img?<img src={img} alt={p.name} width={76} height={76} className="agenda-person-photo" onError={()=>setBroken(true)}/>:<div className="agenda-person-initials">{p.name.split(' ').slice(0,2).map((x:string)=>x[0]).join('')}</div>}<div className="agenda-person-copy"><strong>{p.name}</strong>{p.title&&<span>{p.title}</span>}{p.company&&<b>{p.company}</b>}</div></div>
}
function Session({s}:{s:AgendaSession}){
 const [open,setOpen]=useState(false); const moderators=s.panelists.filter((p:any)=>String(p.role||'').toLowerCase()==='moderator'); const panelists=s.panelists.filter((p:any)=>String(p.role||'').toLowerCase()!=='moderator');
 return <div className={`agenda-session agenda-session-${s.type}`}><div className="agenda-session-time">{s.time}</div><div className="agenda-session-main"><div className="agenda-session-tag">{s.typeLabel}</div><h4>{s.title}</h4>{s.discussionPoints?.length?<button type="button" className="discussion-toggle" onClick={()=>setOpen(!open)}>{open?'Hide':'View'} discussion points <span>{open?'−':'+'}</span></button>:null}{open&&<ul className="discussion-points">{s.discussionPoints!.map(x=><li key={x}>{x}</li>)}</ul>}{s.speakers.length>0&&<div className="agenda-single-speakers">{s.speakers.map((p:any)=><PersonCard key={`${p.name}-${p.role}`} p={p}/>)}</div>}{moderators.length>0&&<div className="agenda-role-group"><p>Moderator</p>{moderators.map((p:any)=><PersonCard key={p.name} p={p}/>)}</div>}{panelists.length>0&&<div className="agenda-role-group"><p>Panelists</p><div className="agenda-panel-grid">{panelists.map((p:any)=><PersonCard key={p.name} p={p}/>)}</div></div>}</div></div>
}
function Module({m}:{m:AgendaModule}){return <><article className="agenda-module-card"><div className="agenda-module-head"><div><span>Thematic Module</span><h3>{m.title}</h3></div>{m.sponsor&&<div className="agenda-module-partner"><small>Module Partner</small><div className="agenda-sponsor-logo"><Image src={sponsorMap[m.sponsor]||m.sponsorLogo||''} alt={m.sponsor} width={180} height={64}/></div></div>}</div>{m.sessions.map((s,i)=><Session key={`${s.time}-${i}`} s={s}/>)}</article>{m.after?.map(a=><div className="agenda-break" key={`${a.time}-${a.title}`}><strong>{a.time}</strong><span>{a.title}</span></div>)}</>}

export default function AgendaClient({days}:Props){
 const [dayId,setDayId]=useState(days[0]?.id||'day1'); const day=useMemo(()=>days.find(d=>d.id===dayId)||days[0],[days,dayId]); const [stageId,setStageId]=useState(day?.stages[0]?.id||'main');
 const activeStage=day?.stages.find(s=>s.id===stageId)||day?.stages[0];
 function chooseDay(id:string){const d=days.find(x=>x.id===id);if(!d)return;setDayId(id);setStageId(d.stages[0]?.id||'main')}
 return <div className="agenda-explorer">
  <div className="agenda-nav-wrap"><div className="agenda-day-tabs">{days.map(d=><button key={d.id} className={dayId===d.id?'active':''} onClick={()=>chooseDay(d.id)}><span>{d.label}</span><small>{d.date}</small></button>)}</div><div className="agenda-stage-tabs">{day.stages.map(s=><button key={s.id} className={activeStage?.id===s.id?'active':''} onClick={()=>setStageId(s.id)}>{s.label}</button>)}</div></div>
  <div className="agenda-stage-content" key={`${dayId}-${activeStage?.id}`}>
   <div className="agenda-stage-heading"><span>{day.label} · {day.date}</span><h2>{activeStage?.label}</h2></div>
   {activeStage?.opening?.map(x=><div className="agenda-break opening" key={`${x.time}-${x.title}`}><strong>{x.time}</strong><span>{x.title}</span></div>)}
   {activeStage?.modules.map(m=><Module key={m.title} m={m}/>)}
  </div>
 </div>
}
