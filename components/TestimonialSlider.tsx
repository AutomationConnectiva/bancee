'use client';
import { useEffect, useState } from 'react';

type Item = [string,string,string];
export default function TestimonialSlider({items}:{items:Item[]}){
  const [index,setIndex]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setIndex(i=>(i+1)%items.length),7000);return()=>clearInterval(id)},[items.length]);
  const [quote,name,org]=items[index];
  return <div className="testimonial-slider" aria-live="polite">
    <blockquote><p>“{quote}”</p><footer><strong>{name}</strong><span>{org}</span></footer></blockquote>
    <div className="testimonial-controls"><button aria-label="Previous testimonial" onClick={()=>setIndex(i=>(i-1+items.length)%items.length)}>←</button><span>{String(index+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><button aria-label="Next testimonial" onClick={()=>setIndex(i=>(i+1)%items.length)}>→</button></div>
  </div>
}
