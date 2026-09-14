import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RequestAttendanceForm from '../../components/RequestAttendanceForm';
import SpeakerGrid from '../../components/SpeakerGrid';
import TestimonialSlider from '../../components/TestimonialSlider';
import { getLogosByIds } from '../../lib/getSponsor';
import { getEventModules } from '../../lib/agenda';
import { getEventSpeakers, getActiveEventIds } from '../../lib/getSpeakers';

export const metadata: Metadata = { title: 'Banking CEE Expo 2026', description: 'Banking CEE Expo 2026 in Prague brings together 250+ attendees from across Central & Eastern Europe for two days of content, networking and business conversations.' };

export default async function ExpoPage() {
  const { expo: expoEventId } = await getActiveEventIds();
  const speakers = expoEventId ? await getEventSpeakers(expoEventId) : [];
  const modules = expoEventId ? await getEventModules(expoEventId) : [];
  const expoLogos = await getLogosByIds([7356, 8243, 8391, 8920, 8913]);  console.log('DEBUG speakers:', JSON.stringify(speakers));
  console.log('DEBUG expoEventId:', expoEventId);
  return (
    <main className="expo-page" id="top">      <section className="expo-hero">
        <Header variant="expo" activePage="expo" ctaLabel="Request Attendance" ctaHref="/request-attendance?event=expo-2026" />
        <div className="expo-hero-media" aria-hidden="true">
          <Image src="/images/expo-2025-hero.webp" alt="" fill priority className="cover expo-hero-image" />
          <div className="expo-hero-overlay" />
        </div>
        <div className="shell expo-hero-content">
          <p className="eyebrow">Banking CEE Expo</p>
          <h1>Where the CEE Banking Community Comes Together.</h1>
          <p className="expo-hero-copy">The flagship Banking CEE gathering — bringing together banking leaders, regulators, associations and technology partners for two days of practical content, high-level networking and meaningful business conversations.</p>
          <div className="actions">
            <a className="btn btn-primary expo-primary" href="/request-attendance?event=expo-2026">Request Attendance</a>
            <a className="btn btn-ghost" href="#agenda">Explore the Agenda</a>
          </div>
          <div className="expo-meta-row">
            <span>November 2026</span><span>Prague, Czechia</span><span>5th Annual Edition</span>
          </div>
          <div className="expo-hero-stats">
            <div><strong>250+</strong><span>Attendees</span></div>
            <div><strong>20+</strong><span>CEE Countries</span></div>
          </div>
        </div>
      </section>

      <section id="speakers" className="section-white expo-speakers">
        <div className="shell expo-section-head"><div><p className="eyebrow dark">Speakers</p><h2>Meet the Leaders Shaping Banking Across CEE.</h2></div><div className="expo-inline-stats"><div><strong>50+</strong><span>Speakers</span></div><div><strong>3</strong><span>Stages</span></div></div></div>
        <div className="shell"><SpeakerGrid speakers={speakers} featured={8} label="Speakers" /></div>
      </section>

      <section id="agenda" className="expo-agenda section-blue">
        <div className="shell expo-section-head light-head">
          <div><p className="eyebrow">Agenda</p><h2 className="section-heading-lines"><span>Built Around the</span><span>Priorities Shaping</span><span>Banking Across CEE.</span></h2></div>
          <div className="expo-inline-stats light-stats"><div><strong>12</strong><span>Thematic Modules</span></div><div><strong>35+</strong><span>Practical Case Studies &amp; Discussions</span></div></div>
        </div>
        <div className="shell module-grid">
          {modules.map((module, index) => <article key={module}><span>{String(index + 1).padStart(2, '0')}</span><h3>{module}</h3></article>)}
        </div>
      </section>

      <section id="experience" className="section-white expo-experience">
        <div className="shell expo-section-head">
          <div><p className="eyebrow dark">Experience</p><h2 className="section-heading-lines"><span>Content Is Only One</span><span>Part of the Expo.</span></h2></div>
          <p className="section-intro">Banking CEE Expo is designed around the conversations that happen between sessions — from focused one-to-one meetings and sponsor activations to informal networking and the evening programme.</p>
        </div>
        <div className="shell expo-story-grid">
          <figure className="story story-main"><Image src="/images/expo-business-2024.webp" alt="Banking CEE Expo business conversation" fill className="cover" /><figcaption>Meaningful business conversations</figcaption></figure>
          <figure className="story"><Image src="/images/expo-2025-tietoevry-activation.webp" alt="Banking CEE Expo technology partner activation" fill className="cover" /><figcaption>Premium partner presence</figcaption></figure>
          <figure className="story"><Image src="/images/expo-networking-2024.webp" alt="Banking CEE Expo networking" fill className="cover" /><figcaption>Relationships beyond the stage</figcaption></figure>
          <figure className="story story-wide"><Image src="/images/expo-2025-audience-applause.webp" alt="Banking CEE Expo audience" fill className="cover" /><figcaption>A community that returns year after year</figcaption></figure>
        </div>
        <div className="shell event-testimonial-wrap"><TestimonialSlider items={[
          ['From vendors and bankers to speakers and panelists, the level of expertise throughout the event is truly premium. Combined with a high standard of organization, it delivers a consistently top-quality experience.','Danijela Vuksanović','Addiko Bank'],
          ['After four years with Banking CEE, what stands out most is the evolution. This year’s event was excellent, with highly relevant topics.','Lyubomir Tankishev','Evrotrust'],
          ['An outstanding event in every aspect — from organization and venue to accommodation, networking and speakers. A truly well-rounded, high-quality experience.','Daniela Bobocea','Exim Banca Românească'],
          ['It was very positive. I could see that many of the people had attended multiple Banking CEE events. There’s a small community of people who are actually friends these days.','Donal Greene','Authologic']
        ]} /></div>
      </section>

      <section id="join" className="expo-join section-navy">
        <div className="shell expo-section-head light-head">
          <div><p className="eyebrow">Join Us</p><h2 className="section-heading-lines"><span>Built for the Right</span><span>People to Be in</span><span>the Room.</span></h2></div>
          <p className="section-intro light-copy">Participation is deliberately structured to protect the quality of the audience and create a useful environment for both banking institutions and technology partners.</p>
        </div>
        <div className="shell join-path-grid">
          <article>
            <span>01 · Banking Community</span>
            <h3>Banks, Financial Institutions, Regulators &amp; Associations</h3>
            <p>Attendance is complimentary and qualification-based. Submit your professional details and our team will review your request.</p>
            <a href="/request-attendance?event=expo-2026">Request Attendance →</a>
          </article>
          <article>
            <span>02 · Technology Partners</span>
            <h3>Technology &amp; Solution Providers</h3>
            <p>Participation is sponsorship-based, creating a clear framework for brand presence, thought leadership and meaningful engagement.</p>
            <a href="/partnership-enquiry?event=expo-2026&source=expo-join">Explore Partnership →</a>
          </article>
        </div>
        <div id="request" className="shell request-box">
          <div><p className="eyebrow">Request Attendance</p><h3>Interested in joining the Expo?</h3><p>Submit a request and, once approved, you’ll receive a private personal registration link.</p></div>
          <RequestAttendanceForm event="expo-2026" compact variant="expo" />
        </div>
      </section>

      <section id="sponsors" className="expo-sponsors section-light">
        <div className="shell expo-section-head">
          <div><p className="eyebrow dark">Sponsors &amp; Technology Partners</p><h2>Partner With the Region&apos;s Banking Community.</h2></div>
          <p className="section-intro">From major branded environments to focused conversations, partnership at Banking CEE Expo is designed around visibility, credibility and genuine engagement with the audience.</p>
        </div>
        <div className="shell sponsor-visuals">
          <div className="sponsor-visual"><Image src="/images/expo-2025-evrotrust-activation.jpg" alt="Evrotrust activation at Banking CEE Expo" fill className="cover" /></div>
          <div className="sponsor-visual"><Image src="/images/expo-2025-tietoevry-activation.jpg" alt="Technology partner activation at Banking CEE Expo" fill className="cover" /></div>
        </div>
        <div className="shell confirmed-sponsor-block">
          <p className="sponsor-tier-label">Gold Sponsor</p>
          <div className="sponsor-logo-grid sponsor-logo-grid-gold">
            <div><img src={expoLogos[7356]} alt="Authologic" width={300} height={170} /></div>
          </div>
          <p className="sponsor-tier-label">Silver Sponsors</p>
          <div className="sponsor-logo-grid">
            <div><img src={expoLogos[8243]} alt="Evrotrust" width={240} height={140} /></div>
            <div><img src={expoLogos[8878]} alt="ERI" width={240} height={140} /></div>
            <div><img src={expoLogos[8920]} alt="Tieto Banktech" width={240} height={140} /></div>
            <div><img src={expoLogos[8913]} alt="Guardsquare" width={240} height={140} className="logo-larger" /></div>
          </div>
        </div>
        <div className="shell sponsor-cta"><a className="btn expo-dark-btn" href="/partnership-enquiry?event=expo-2026&source=expo-sponsors">Explore Partnership Opportunities</a></div>
      </section>

      <Footer/>
    </main>
  );
}