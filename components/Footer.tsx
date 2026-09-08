import Image from 'next/image';
export default function Footer(){return <footer className="footer">
  <div className="shell footer-main">
    <div className="footer-brand"><Image src="/images/banking-cee-logo-white.png" alt="Banking CEE Network" width={220} height={80}/><p>Connecting the banking community across Central &amp; Eastern Europe.</p></div>
    <div><strong>Explore</strong><a href="/">Network</a><a href="/expo">Banking CEE Expo</a><a href="/summit">Digital Banking CEE Summit</a><a href="/insights">Insights</a><a href="/partners">Partners</a><a href="/contact">Contact</a></div>
    <div><strong>Participate</strong><a href="/request-attendance">Attend</a><a href="/speaker-interest">Speak</a><a href="/#advisory-board">Advisory Board</a><a href="/partnership-enquiry">Partner</a></div>
    <div><strong>Our Events</strong><p>Banking CEE Expo<br/>19–20 November 2026 · Prague</p><a href="/expo">Explore Expo →</a><p>Digital Banking CEE Summit<br/>May 2027 · Date &amp; Location TBA</p><a href="/summit">Explore Summit →</a></div>
    <div><strong>Connect</strong><a href="mailto:info@bancee.eu">info@bancee.eu</a><a href="https://www.linkedin.com/company/banking-cee-network/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.youtube.com/@BankingCEE" target="_blank" rel="noreferrer">YouTube ↗</a></div>
  </div>
  <div className="shell footer-bottom"><span>© 2026 Banking CEE Network · A Connectiva Conferences &amp; Events community</span><span><a href="/terms-and-conditions">Terms &amp; Conditions</a> · <a href="/privacy-policy">Privacy Policy</a></span></div>
</footer>}
