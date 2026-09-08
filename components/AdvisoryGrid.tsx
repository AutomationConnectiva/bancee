'use client';
import { useState } from 'react';
import Image from 'next/image';

export type Advisor = { name: string; title: string; org: string; image: string };

export default function AdvisoryGrid({ advisors, featured }: { advisors: Advisor[]; featured: number }) {
  const [open, setOpen] = useState(false);
  const shown = open ? advisors : advisors.slice(0, featured);
  return (
    <>
      <div className="shell advisory-grid">
        {shown.map((person) => (
          <article className="advisor" key={person.name}>
            <div className="advisor-photo"><Image src={person.image} alt={person.name} fill className="cover" /></div>
            <div className="advisor-copy"><h3>{person.name}</h3><p>{person.title}</p><strong>{person.org}</strong></div>
          </article>
        ))}
      </div>
      {advisors.length > featured && (
        <div className="shell inline-link">
          <a href="#" onClick={(e) => { e.preventDefault(); setOpen(v => !v); }}>
            {open ? 'Show Fewer ↑' : 'View the Full Advisory Board →'}
          </a>
        </div>
      )}
    </>
  );
}