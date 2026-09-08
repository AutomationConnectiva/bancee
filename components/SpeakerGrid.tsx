'use client';
import { useState } from 'react';
import Image from 'next/image';
export type Speaker={name:string;title:string;org:string;image:string};
export default function SpeakerGrid({speakers,featured,label='Speakers'}:{speakers:Speaker[];featured:number;label?:string}){
 const [open,setOpen]=useState(false); const shown=open?speakers:speakers.slice(0,featured);
 return <><div className="speaker-card-grid">{shown.map(s=><article className="speaker-card" key={s.name}><div className="speaker-headshot"><Image src={s.image} alt={s.name} fill sizes="(max-width: 700px) 50vw, 25vw" /></div><div className="speaker-card-copy"><h3>{s.name}</h3><p>{s.title}</p><strong>{s.org}</strong></div></article>)}</div>{speakers.length>featured&&<div className="speaker-more-wrap"><button className="speaker-more" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>{open?`Show Fewer ${label} ↑`:`View All ${label} ↓`}</button></div>}</>
}