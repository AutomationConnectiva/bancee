'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type HeaderProps = {
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'network' | 'expo' | 'summit';
  activePage?: 'network' | 'expo' | 'summit' | 'insights' | 'partners' | 'contact';
};

const items=[['Network','/','network'],['Expo','/expo','expo'],['Summit','/summit','summit'],['Insights','/insights','insights'],['Partners','/partners','partners'],['Contact','/contact','contact']] as const;

export default function Header({ ctaLabel = 'Join the Network', ctaHref = '/#join', variant = 'network', activePage }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll=()=>setScrolled(window.scrollY>72);
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
    return ()=>window.removeEventListener('scroll',onScroll);
  },[]);
  useEffect(()=>{ document.body.classList.toggle('menu-open',open); return ()=>document.body.classList.remove('menu-open'); },[open]);
  return <header className={`site-header site-header-${variant} ${scrolled?'site-header-scrolled':''} ${open?'menu-is-open':''}`}>
    <a className="brand" href="/" aria-label="Banking CEE Network home"><Image src="/images/banking-cee-logo-white.png" alt="Banking CEE Network" width={230} height={70} priority /></a>
    <nav className="nav desktop-nav" aria-label="Primary navigation">{items.map(([label,href,key])=><a key={key} href={href} className={activePage===key?'active':''}>{label}</a>)}</nav>
    <a className="header-cta" href={ctaHref}>{ctaLabel}</a>
    <button type="button" className="mobile-menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span></span><span></span></button>
    <div className={`mobile-nav-panel ${open?'open':''}`} aria-hidden={!open}>
      <div className="mobile-nav-inner">{items.map(([label,href,key],i)=><a key={key} href={href} className={activePage===key?'active':''} onClick={()=>setOpen(false)}><span>{String(i+1).padStart(2,'0')}</span><strong>{label}</strong><b>→</b></a>)}<a className="mobile-nav-cta" href={ctaHref} onClick={()=>setOpen(false)}>{ctaLabel} →</a></div>
    </div>
  </header>;
}
