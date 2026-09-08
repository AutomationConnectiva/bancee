import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const base='https://www.bancee.eu';return['','/expo','/summit','/insights','/partners','/contact','/request-attendance','/partnership-enquiry','/speaker-interest','/privacy-policy','/terms-and-conditions'].map(path=>({url:base+path,lastModified:new Date()}))}
