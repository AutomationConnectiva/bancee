import Image from 'next/image';
import Header from '../components/Header';
import TestimonialSlider from '../components/TestimonialSlider';
import AdvisoryGrid from '../components/AdvisoryGrid';
import { getAdvisors } from '../lib/getSpeakers';
import Footer from '../components/Footer';
import AudienceSplit from '../components/AudienceSplit';

const stats = [
  ['15+', 'Events'],
  ['20+', 'CEE Countries'],
  ['2,500+', 'Attendees'],
  ['100+', 'Technology Partners'],
];

const logoGroups = [
  ['Banks & Financial Institutions', ['66.png','67.png','68.png','69.png','70.png','75.png','76.png','78.png'], 'banks'],
  ['Regulators & Banking Associations', ['44.png','46.png','47.png','48.png','49.png','51.png','52.png','53.png'], 'associations'],
  ['Technology Partners', ['2.png','7.png','9.png','12.png','33.png','temenos.png','comarch.png','tieto.png'], 'technology'],
];

const testimonials: [string, string, string][] = [
  ['From vendors and bankers to speakers and panelists, the level of expertise throughout the event is truly premium. Combined with a high standard of organization, it delivers a consistently top-quality experience.', 'Danijela Vuksanović', 'Addiko Bank'],
  ['After four years with Banking CEE, what stands out most is the evolution. This year’s event was excellent, with highly relevant topics.', 'Lyubomir Tankishev', 'Evrotrust'],
  ['An outstanding event in every aspect — from organization and venue to accommodation, networking and speakers. A truly well-rounded, high-quality experience.', 'Daniela Bobocea', 'Exim Banca Românească'],
  ['It was very positive. I could see that many of the people had attended multiple Banking CEE events. There’s a small community of people who are actually friends these days.', 'Donal Greene', 'Authologic'],
];

export default async function Home() {
  const advisory = await getAdvisors();
  return (
    <main id="top">
      <section className="hero">
        <Header />
        <div className="hero-media" aria-hidden="true">
          <Image src="/images/summit-networking.webp" alt="" fill priority className="cover" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content shell">
          <p className="eyebrow">Banking CEE Network</p>
          <h1>Connecting the Banking Community Across Central &amp; Eastern Europe</h1>
          <p className="hero-copy">Bringing together banks, financial institutions, regulators, banking associations and technology partners from across CEE to exchange knowledge, build meaningful relationships and move the industry forward.</p>
          <div className="actions">
            <a className="btn btn-primary" href="#join">Join the Network</a>
            <a className="btn btn-ghost" href="#events">Explore Our Events</a>
          </div>
          <div className="city-line">Prague · Bucharest · Budapest · Sofia · CEE</div>
        </div>
      </section>

      <section id="network" className="numbers section-light">
        <div className="shell">
          <p className="eyebrow dark">Network in Numbers</p>
          <h2 className="section-heading-lines"><span>Built Across CEE.</span><span>Built Over Time.</span></h2>
          <div className="stat-grid">
            {stats.map(([number, label]) => <div className="stat" key={label}><strong>{number}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section id="advisory-board" className="community section-white">
        <div className="shell split-head">
          <div><p className="eyebrow dark">Shaped by the Community</p><h2 className="section-heading-lines"><span>Industry Experience</span><span>at the Heart of</span><span>Banking CEE.</span></h2></div>
          <p>Our Advisory Board brings together 18+ senior industry leaders from 10+ countries, with more than 250 years of combined experience. Representing perspectives from across the banking ecosystem, the Board provides insight into the priorities, challenges and opportunities shaping the industry.</p>
        </div>
         <AdvisoryGrid advisors={advisory} featured={5} />
      </section>

    <section className="journey section-navy">
  <div className="shell journey-grid">
    <div>
      <p className="eyebrow">Our Journey</p>
      <h2 className="section-heading-lines"><span>From Online Beginnings</span><span>to a Banking Community</span><span>Across CEE.</span></h2>
      <p>Banking CEE began during COVID, bringing the industry together online through dedicated summits focused on payments, lending and customer experience. In 2022, those communities came together in person for the first Banking CEE Expo in Prague — beginning a journey that has since taken us to Bucharest, Budapest and Sofia.</p>
    </div>
    <div className="map-card">
      <Image src="/images/cee-map.png" alt="Map of Central and Eastern Europe highlighting the Banking CEE footprint" fill className="map-image" />
    </div>
  </div>
</section>

      <section className="ecosystem section-light">
        <div className="shell">
          <p className="eyebrow dark">Across the Network</p><h2>Bringing the Banking Ecosystem Together.</h2>
          <div className="ecosystem-logo-groups">
            {logoGroups.map(([title, files, folder]) => <div className="logo-group" key={title as string}><h3>{title as string}</h3><div className="logo-grid">{(files as string[]).map(file => <div className="logo-cell" key={file}><Image src={`/images/logos/${folder}/${file}`} alt="" width={180} height={80} className="logo-img" /></div>)}</div></div>)}
          </div>
        </div>
      </section>

      <section id="events" className="events section-white">
        <div className="shell"><p className="eyebrow dark">Our Events</p><h2 className="section-heading-lines"><span>One Network.</span><span>Two Distinct Experiences.</span></h2></div>
        <div className="shell event-grid">
          <article className="event-card expo-card">
            <Image src="/images/expo-stage.webp" alt="Banking CEE Expo audience and stage" fill className="cover" />
            <div className="event-shade"/><div className="event-content"><span>Banking CEE Expo — Breadth</span><h3>Banking CEE Expo</h3><p>Scale, breadth and business interaction across multiple stages, networking formats and partner activations.</p><div className="event-stats"><b>250+ <small>Attendees</small></b><b>3 <small>Stages</small></b><b>18+ <small>Hours of Content</small></b></div><a href="/expo">Explore Expo →</a></div>
          </article>
          <article className="event-card summit-card">
            <Image src="/images/summit-community.webp" alt="Digital Banking CEE Summit community" fill className="cover" />
            <div className="event-shade"/><div className="event-content"><span>Digital Banking CEE Summit — Depth</span><h3>Digital Banking CEE Summit</h3><p>A more intimate, senior-level environment for focused digital banking conversations and closer executive networking.</p><div className="event-stats"><b>100 <small>Attendees</small></b><b>1 <small>Main Stage</small></b><b>75%+ <small>C-Level, Directors & Heads</small></b></div><a href="/summit">Explore Summit →</a></div>
          </article>
        </div>
        <div className="shell participation"><strong>Participation by Design</strong><p>Banks, financial institutions, regulators and banking associations attend on a complimentary, qualification-based basis, while technology and solution providers participate exclusively through sponsorship. We don’t sell delegate tickets — helping us protect the audience balance at the heart of Banking CEE.</p></div>
      </section>

      <section className="balance section-navy">
        <div className="shell balance-grid"><div><p className="eyebrow">Built Differently</p><h2>Because Who&apos;s in the Room Changes the Conversation.</h2><p>Banking CEE is built around a carefully balanced audience — designed to create the right environment for relevant conversations, different perspectives and meaningful relationships.</p></div><AudienceSplit variant="home"/></div>
      </section>

      <section className="experience section-white">
        <div className="shell"><p className="eyebrow dark">The Banking CEE Experience</p><h2>See What Banking CEE Feels Like.</h2></div>
        <div className="shell photo-grid">
          <div className="photo photo-lg"><Image src="/images/expo-audience.webp" alt="Banking CEE audience" fill className="cover" /></div>
          <div className="photo"><Image src="/images/summit-networking1.webp" alt="Banking CEE networking" fill className="cover" /></div>
          <div className="photo"><Image src="/images/expo-sponsor.webp" alt="Banking CEE sponsor activation" fill className="cover" /></div>
          <div className="photo photo-wide"><Image src="/images/summit-panel.webp" alt="Digital Banking CEE Summit panel" fill className="cover" /></div>
        </div>
        <div className="shell testimonial-wrap">
          <p className="eyebrow dark">In Their Words</p>
          <TestimonialSlider items={testimonials} />
        </div>
      </section>


 
  <section id="insights" className="video-experience section-light">
  <div className="shell split-head">
    <div>
      <p className="eyebrow dark">Watch the Experience</p>
      <h2>See Banking CEE in Action.</h2>
    </div>
    <p>Experience the conversations, connections and atmosphere that bring the Banking CEE community together across Central &amp; Eastern Europe.</p>
  </div>
  <div className="shell video-embed-wrap">
    <div className="video-embed">
     <iframe
        src="https://www.youtube.com/embed/f3aZWQJfxYY?autoplay=0&loop=1&playlist=f3aZWQJfxYY&rel=0"
        title="Digital Banking CEE Summit 2026 | Bucharest – Event Highlights"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowFullScreen
/>
    </div>
  </div>
  <div className="shell video-tagline"><span>More Than Events. A Stronger Banking Community.</span></div>
</section>



      <section id="join" className="join section-navy"><div className="shell"><p className="eyebrow">Join Banking CEE</p><h2 className="section-heading-lines"><span>Be Part of What</span><span>Comes Next.</span></h2><p className="join-intro">Whether you&apos;re looking to exchange ideas with peers, contribute your expertise or build relationships across the banking ecosystem, there&apos;s a place for you within Banking CEE.</p><div className="join-grid"><div><span>Attend</span><h3>Banks, Financial Institutions, Regulators &amp; Associations</h3><p>Join the Banking CEE community on a complimentary, qualification-based basis.</p><a href="/request-attendance">Request Attendance →</a></div><div><span>Contribute</span><h3>Banking Leaders &amp; Industry Experts</h3><p>Share your experience, contribute to the conversation and explore speaker or Advisory Board opportunities.</p><a href="/speaker-interest">Get Involved →</a></div><div id="partners"><span>Partner</span><h3>Technology &amp; Solution Providers</h3><p>Build meaningful relationships with banking leaders across CEE through Banking CEE partnership opportunities.</p><a href="/partnership-enquiry">Explore Partnerships →</a></div></div></div></section>

      <Footer/>
    </main>
  );
}
