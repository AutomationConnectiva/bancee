'use client';
import Image from 'next/image';
import {useState} from 'react';

const items=[
 {type:'INTERVIEW',time:'3 MIN WATCH',title:'TBA',person:'TBA',img:'/images/summit-2026-keynote.jpg',cta:'WATCH →'},
 {type:'VIDEO',time:'TBA',title:'TBA',person:'TBA',img:'/images/summit-2026-panel.jpg',cta:'WATCH →'},
 {type:'ARTICLE',time:'TBA',title:'TBA',person:'TBA',img:'/images/expo-2025-speaker.jpg',cta:'READ →'},
 {type:'VIDEO',time:'TBA',title:'TBA',person:'TBA',img:'/images/expo-networking-2024.jpg',cta:'WATCH →'}
];
export default function InsightsExplorer(){
 const [filter,setFilter]=useState('ALL'); const [more,setMore]=useState(false);
 const list=items.filter(x=>filter==='ALL'||x.type===filter); const featured=list[0]||items[0]; const support=(list.length>1?list.slice(1):items.slice(1));
 return <>
  <div className="insight-filters">{['ALL','INTERVIEW','ARTICLE','VIDEO'].map(f=><button key={f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f==='INTERVIEW'?'INTERVIEWS':f==='ARTICLE'?'ARTICLES':f==='VIDEO'?'VIDEOS':f}</button>)}</div>
  <article className="editorial-feature"><div className="editorial-image"><Image src={featured.img} alt="Banking CEE insight" fill className="cover"/></div><div className="editorial-copy"><span>{featured.type} · {featured.time}</span><h3>{featured.title}</h3><p>{featured.person}</p><a href="#newsletter">{featured.cta}</a></div></article>
  <div className="editorial-grid">{support.slice(0,more?6:3).map((x,i)=><article key={`${x.type}-${i}`}><div className="editorial-thumb"><Image src={x.img} alt="" fill className="cover"/></div><span>{x.type} · {x.time}</span><h3>{x.title}</h3><p>{x.person}</p><a href="#newsletter">{x.cta}</a></article>)}</div>
  <div className="load-more"><button onClick={()=>setMore(v=>!v)}>{more?'SHOW LESS ↑':'LOAD MORE →'}</button></div>
 </>
}
