import type { Metadata } from 'next';
import './globals.css';
import PremiumMotion from '../components/PremiumMotion';
export const metadata: Metadata={title:{default:'Banking CEE Network | Connecting Banking Leaders Across CEE',template:'%s | Banking CEE Network'},description:'Banking CEE Network connects banks, regulators, associations and technology partners across Central & Eastern Europe.',metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://www.bancee.eu'),openGraph:{type:'website',siteName:'Banking CEE Network',title:'Banking CEE Network',description:'Connecting the banking community across Central & Eastern Europe.'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<PremiumMotion/></body></html>}