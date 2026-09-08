import type {Metadata} from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PublicRegistration from '../../components/PublicRegistration';
export const metadata:Metadata={title:'Registration | Banking CEE',description:'Complete your Banking CEE event registration.',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{event?:string;source?:string}>}){
 const p=await searchParams;const initial=p.event==='expo-2026'||p.event==='summit-2027'?p.event:undefined;const variant=initial==='summit-2027'?'summit':initial==='expo-2026'?'expo':'network';
 return <main className="registration-public-page"><section className={`request-page-hero request-page-${variant}`}><Header variant={variant} ctaLabel="Explore Events" ctaHref="/#events"/><div className="shell request-page-heading"><p className="eyebrow">Banking CEE Registration</p><h1>Complete Your Registration.</h1><p>{initial?'Please complete your registration details below.':'Choose the event you are joining, then complete the full attendee registration form.'}</p></div></section><section className="section-white"><div className="shell registration-shell public-registration-shell"><PublicRegistration initialEvent={initial} source={p.source||'direct-registration'}/></div></section><Footer/></main>
}
