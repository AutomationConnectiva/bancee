import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return{rules:[{userAgent:'*',allow:'/',disallow:['/register/','/admin/']}],sitemap:'https://www.bancee.eu/sitemap.xml'}}
