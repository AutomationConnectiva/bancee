import { supabase } from './supabase';

function directDrive(url?: string | null) {
  if (!url) return '';
  const m = url.match(/\/d\/(.+?)\//);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : url;
}
export async function getLogosByNames(names: string[]): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('companies')
    .select('company_name, image_url');
  if (error || !data) { console.error(error); return {}; }
  const map: Record<string, string> = {};
  for (const name of names) {
    const match = data.find((c: any) => c.company_name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(c.company_name.toLowerCase()));
    if (match) map[name] = directDrive(match.image_url);
  }
  return map;
}

export async function getAllLogos(): Promise<{ name: string; logo: string }[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('company_name, image_url')
    .not('image_url', 'is', null)
    .neq('image_url', '');
  if (error || !data) { console.error(error); return []; }
  return data.map((c: any) => ({ name: c.company_name, logo: directDrive(c.image_url) }));
}

export async function getLogosByIds(ids: number[]): Promise<Record<number, string>> {
  const { data, error } = await supabase
    .from('companies')
    .select('company_id, image_url')
    .in('company_id', ids);
  if (error || !data) { console.error(error); return {}; }
  const map: Record<number, string> = {};
  for (const c of data) map[c.company_id] = directDrive(c.image_url);
  return map;
}