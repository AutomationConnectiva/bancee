'use client';
import { useEffect } from 'react';

export default function PremiumMotion(){
  useEffect(()=>{
    const selectors = [
      'main > section:not(.hero):not(.expo-hero):not(.summit-hero):not(.partner-hero):not(.insights-hero):not(.contact-hero):not(.request-page-hero):not(.form-hero):not(.agenda-hero)',
      '.event-card','.partner-event','.partner-format-list article','.photo','.story','.summit-story','.stat','.advisor','.join-grid>div','.join-path-grid>article','.summit-join-grid>article','.partner-logo-grid>div','.bank-logo-grid>div','.sponsor-logo-grid>div','.agenda-module-card','.agenda-next-card','.partnership-choice'
    ];
    const els = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(',')));
    els.forEach((el,i)=>{ el.classList.add('premium-reveal'); el.style.setProperty('--reveal-delay', `${Math.min((i%6)*55,275)}ms`); });
    if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('is-visible')); }
    else {
      const io = new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting){ (entry.target as HTMLElement).classList.add('is-visible'); io.unobserve(entry.target); } }),{threshold:.12,rootMargin:'0px 0px -5% 0px'});
      els.forEach(el=>io.observe(el));
    }

    const statSelectors=[
      '.stat strong','.expo-hero-stats strong','.expo-inline-stats strong','.summit-hero-stats strong','.summit-inline-stats strong',
      '.partner-proof-stats strong','.audience-segment strong','.agenda-cover-stats strong'
    ];
    const stats=Array.from(document.querySelectorAll<HTMLElement>(statSelectors.join(',')));
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parse=(text:string)=>{
      const m=text.trim().match(/^(~?)([\d,.]+)(.*)$/); if(!m)return null;
      const raw=m[2]; const decimals=(raw.split('.')[1]||'').length; const value=Number(raw.replace(/,/g,''));
      return Number.isFinite(value)?{prefix:m[1],value,suffix:m[3],decimals,comma:raw.includes(',')}:null;
    };
    const animate=(el:HTMLElement)=>{
      if(el.dataset.counted==='1')return; const parsed=parse(el.textContent||''); if(!parsed)return; el.dataset.counted='1';
      const original=el.textContent||''; if(reduce){el.textContent=original;return;}
      const duration=1100; const start=performance.now();
      const frame=(now:number)=>{const t=Math.min(1,(now-start)/duration);const eased=1-Math.pow(1-t,3);const current=parsed.value*eased;let num=parsed.decimals?current.toFixed(parsed.decimals):Math.round(current).toString();if(parsed.comma)num=Number(num).toLocaleString('en-US',{minimumFractionDigits:parsed.decimals,maximumFractionDigits:parsed.decimals});el.textContent=`${parsed.prefix}${num}${parsed.suffix}`;if(t<1)requestAnimationFrame(frame);else el.textContent=original;};
      requestAnimationFrame(frame);
    };
    if(!('IntersectionObserver' in window)) stats.forEach(animate);
    else {const countIo=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animate(e.target as HTMLElement);countIo.unobserve(e.target)}}),{threshold:.55});stats.forEach(s=>countIo.observe(s));}
  },[]);
  return null;
}
