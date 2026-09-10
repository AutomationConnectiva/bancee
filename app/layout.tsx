import type { Metadata } from 'next';
// The stylesheet is provided by the app's runtime; TypeScript has no declaration
// for CSS side-effect imports in this project configuration.
// @ts-expect-error CSS side-effect import
import './globals.css';
import PremiumMotion from '../components/PremiumMotion';
export const metadata: Metadata={title:{default:'Banking CEE Network | Connecting Banking Leaders Across CEE',template:'%s | Banking CEE Network'},description:'Banking CEE Network connects banks, regulators, associations and technology partners across Central & Eastern Europe.',metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://www.bancee.eu'),openGraph:{type:'website',siteName:'Banking CEE Network',title:'Banking CEE Network',description:'Connecting the banking community across Central & Eastern Europe.'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<PremiumMotion/></body></html>}
