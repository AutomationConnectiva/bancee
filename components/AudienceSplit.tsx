'use client';
import {useState} from 'react';

type Variant='home'|'partners';
export default function AudienceSplit({variant='home'}:{variant?:Variant}){
  const [active,setActive]=useState<'banking'|'technology'|null>(null);
  const bankingCopy=variant==='partners'
    ? 'A qualification-based banking audience designed to protect relevance and create meaningful access for partners.'
    : 'The core of the Banking CEE community — banks, financial institutions, regulators and banking associations.';
  const techCopy=variant==='partners'
    ? 'Selected technology and solution providers participate through partnership, thought leadership and event engagement.'
    : 'Technology and solution providers contribute expertise, innovation and practical perspectives to the community.';
  return <div className={`audience-split audience-split-${variant} ${active?`is-${active}`:''}`}>
    <div className="audience-split-bar" role="group" aria-label="Audience composition">
      <button type="button" className="audience-segment audience-banking" aria-pressed={active==='banking'} onClick={()=>setActive(active==='banking'?null:'banking')}>
        <strong>~70%</strong><span>Banks, Financial Institutions, Regulators &amp; Banking Associations</span>{variant==='partners'&&<small>COMPLIMENTARY · QUALIFICATION-BASED</small>}
      </button>
      <button type="button" className="audience-segment audience-technology" aria-pressed={active==='technology'} onClick={()=>setActive(active==='technology'?null:'technology')}>
        <strong>~30%</strong><span>Technology &amp; solution providers</span>{variant==='partners'&&<small>SPONSORSHIP-BASED PARTICIPATION</small>}
      </button>
    </div>
    <div className="audience-split-detail" aria-live="polite">
      <span>{active==='technology'?'Technology Partners':active==='banking'?'Banking Community':'Balanced by Design'}</span>
      <p>{active==='technology'?techCopy:active==='banking'?bankingCopy:'Tap or hover either side to explore how the Banking CEE audience is structured.'}</p>
    </div>
  </div>;
}
