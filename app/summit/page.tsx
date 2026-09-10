import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RequestAttendanceForm from '../../components/RequestAttendanceForm';
import SpeakerGrid from '../../components/SpeakerGrid';
import TestimonialSlider from '../../components/TestimonialSlider';
import { getSpeakers } from '../../lib/getSpeakers';
import { getLogosByIds } from '../../lib/getSponsor';

export const metadata: Metadata = { title: 'Digital Banking CEE Summit 2027', description: 'A focused senior-level gathering for 100 banking executives shaping digital banking across Central & Eastern Europe.' };
const modules = [
  'AI, Automation & the Intelligent Bank',
  'Digital Customer Experience & Personalisation',
  'Payments, Cards & Transaction Banking',
  'Lending, Credit & Decisioning',
  'Open Finance, Ecosystems & Embedded Banking',
  'Digital Identity, Fraud & Trust',
  'Core Modernisation, Cloud & Data',
];

export default async function SummitPage() {
  const speakers = await getSpeakers('summit');
  const summitLogos = await getLogosByIds([8243, 8391, 2050, 7356, 8127, 823]); // Evrotrust, ERI, Salesforce, Authologic, fme, OneSpan
  return (
    <main className="summit-page" id="top">
      <section className="summit-hero">
        <Header variant="summit" activePage="summit" ctaLabel="Request Attendance" ctaHref="/request-attendance?event=summit-2027" />
        <div className="summit-hero-media" aria-hidden="true">
          <Image src="/images/summit-2026-panel.jpg" alt="" fill priority className="cover" />
          <div className="summit-hero-overlay" />
        </div>
        <div className="shell summit-hero-content">
          <p className="eyebrow summit-eyebrow">Digital Banking CEE Summit</p>
          <h1>Focused Conversations for the Next Generation of Banking.</h1>
          <p className="summit-hero-copy">A senior, focused gathering for banking leaders shaping digital transformation across Central &amp; Eastern Europe — combining practical content, peer-to-peer discussion and high-quality networking in a more intimate setting.</p>
          <div className="actions">
            <a className="btn summit-primary" href="/request-attendance?event=summit-2027">Request Attendance</a>
            <a className="btn btn-ghost" href="#agenda">Explore the Agenda</a>
          </div>
          <div className="summit-meta-row">
            <span>May 2027</span><span>Date &amp; Location TBA</span><span>Digital Banking CEE Summit</span>
          </div>
          <div className="summit-hero-stats">
            <div><strong>100</strong><span>Attendees</span></div>
            <div><strong>75%+</strong><span>C-Level, Directors & Heads</span></div>
          </div>
        </div>
      </section>

      <section id="speakers" className="section-white summit-speakers">
        <div className="shell summit-section-head"><div><p className="eyebrow dark">2026 Speakers</p><h2 className="section-heading-lines"><span>Senior Practitioners.</span><span>Practical Perspectives.</span></h2></div><div className="expo-inline-stats summit-speaker-stats"><div><strong>30+</strong><span>Speakers</span></div><div><strong>1</strong><span>Stage</span></div></div></div><div className="shell"><p className="section-intro summit-speaker-note">A look back at the senior banking and industry leaders who joined the 2026 Summit. The 2027 speaker line-up will be announced as the programme develops.</p></div>
        <div className="shell">
          <SpeakerGrid speakers={speakers} featured={8} label="2026 Speakers" />
        </div>
      </section>

      <section id="agenda" className="summit-agenda">
        <div className="shell summit-section-head summit-light-head">
          <div><p className="eyebrow summit-eyebrow">Agenda</p><h2 className="section-heading-lines"><span>Seven Themes.</span><span>One Focused</span><span>Conversation.</span></h2></div>
          <div className="summit-inline-stats"><div><strong>7</strong><span>Thematic Modules</span></div><div><strong>20+</strong><span>Practical Case Studies &amp; Discussions</span></div></div>
        </div>
        <div className="shell summit-module-list">
          {modules.map((module, index) => (
            <article key={module}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{module}</h3>
              <div className="module-line" />
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="section-white summit-experience">
        <div className="shell summit-section-head">
          <div><p className="eyebrow dark">Experience</p><h2 className="section-heading-lines"><span>More Space for the</span><span>Conversations</span><span>That Matter.</span></h2></div>
          <p className="section-intro">The Summit is deliberately smaller and more personal than the Expo. Networking is not a break between sessions — it is a core part of the experience.</p>
        </div>
        <div className="shell summit-story-grid">
          <figure className="summit-story summit-story-main"><Image src="/images/summit-2026-one-to-one.jpg" alt="One-to-one meeting at the Digital Banking CEE Summit" fill className="cover" /><figcaption>Focused one-to-one conversations</figcaption></figure>
          <figure className="summit-story"><Image src="/images/summit-2026-community.jpg" alt="Digital Banking CEE Summit community" fill className="cover" /><figcaption>A senior regional community</figcaption></figure>
          <figure className="summit-story"><Image src="/images/summit-2026-audience.jpg" alt="Digital Banking CEE Summit audience" fill className="cover" /><figcaption>Engaged, practical discussion</figcaption></figure>
          <figure className="summit-story summit-story-wide"><Image src="/images/summit-2026-human.jpg" alt="Digital Banking CEE Summit participants sharing a relaxed moment" fill className="cover" /><figcaption>Relationships beyond the programme</figcaption></figure>
        </div>
        <div className="shell event-testimonial-wrap"><TestimonialSlider items={[
          ['From vendors and bankers to speakers and panelists, the level of expertise throughout the event is truly premium. Combined with a high standard of organization, it delivers a consistently top-quality experience.','Danijela Vuksanović','Addiko Bank'],
          ['After four years with Banking CEE, what stands out most is the evolution. This year’s event was excellent, with highly relevant topics.','Lyubomir Tankishev','Evrotrust'],
          ['An outstanding event in every aspect — from organization and venue to accommodation, networking and speakers. A truly well-rounded, high-quality experience.','Daniela Bobocea','Exim Banca Românească'],
          ['It was very positive. I could see that many of the people had attended multiple Banking CEE events. There’s a small community of people who are actually friends these days.','Donal Greene','Authologic']
        ]} /></div>
      </section>

      <section id="join" className="summit-join">
        <div className="shell summit-section-head summit-light-head">
          <div><p className="eyebrow summit-eyebrow">Join Us</p><h2>A Focused Room, Built Around the Right Audience.</h2></div>
          <p className="section-intro summit-light-copy">Attendance is structured to maintain a strong banking audience while creating meaningful opportunities for selected technology partners.</p>
        </div>
        <div className="shell summit-join-grid">
          <article>
            <span>Banking Community</span>
            <h3>Banks, Financial Institutions, Regulators &amp; Associations</h3>
            <p>Complimentary attendance is qualification-based. Submit your details and our team will review your request before sending a private registration invitation.</p>
            <a href="/request-attendance?event=summit-2027">Request Attendance →</a>
          </article>
          <article>
            <span>Technology Partners</span>
            <h3>Technology &amp; Solution Providers</h3>
            <p>Participation is sponsorship-based, with a limited partner environment designed around relevant visibility, thought leadership and direct engagement.</p>
            <a href="/partnership-enquiry?event=summit-2027&source=summit-join">Explore Partnership →</a>
          </article>
        </div>
        <div id="request" className="shell summit-request-box">
          <div><p className="eyebrow summit-eyebrow">Request Attendance</p><h3>Interested in joining the next Summit?</h3><p>May 2027 — date and location to be announced. Submit your interest and we’ll review your profile when registration opens.</p></div>
          <RequestAttendanceForm event="summit-2027" compact variant="summit" />
        </div>
      </section>

      <section id="sponsors" className="section-white summit-sponsors">
        <div className="shell summit-section-head">
          <div><p className="eyebrow dark">Sponsors</p><h2>Partnership With Purpose.</h2></div>
          <p className="section-intro">Summit partnerships are designed for technology companies that want relevant visibility and direct engagement with a concentrated senior banking audience.</p>
        </div>
        <div className="shell confirmed-sponsor-block">
          <p className="sponsor-history-note">2026 Sponsors</p>
          <p className="sponsor-tier-label">Silver Sponsors</p>
          <div className="sponsor-logo-grid summit-logo-grid">
            <div><img src={summitLogos[8243]} alt="Evrotrust" width={240} height={140} /></div>
            <div><img src={summitLogos[8391]} alt="ERI" width={240} height={140} /></div>
            <div><img src={summitLogos[2050]} alt="Salesforce" width={240} height={140} /></div>
            <div><img src={summitLogos[7356]} alt="Authologic" width={240} height={140} /></div>
            <div><img src={summitLogos[8127]} alt="fme" width={240} height={140} /></div>
            <div><img src={summitLogos[823]} alt="OneSpan" width={240} height={140} /></div>
          </div>
          <div className="sponsor-cta"><a className="btn summit-dark-btn" href="/partnership-enquiry?event=summit-2027&source=summit-sponsors">Explore Partnership Opportunities</a></div>
        </div>
      </section>

      <Footer/>
    </main>
  );
}