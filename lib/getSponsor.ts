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

export type EventSponsor = {
  company_id: number;
  company_name: string;
  package_name: string;
  logo: string;
};

export async function getEventSponsors(
  eventId: string
): Promise<EventSponsor[]> {

  if (!eventId) return [];

  // Get confirmed sponsorship deals for this event
  const { data: deals, error } = await supabase
    .from('sponsorship_deals')
    .select(`
      company_id,
      package_name,
      companies (
        company_name
      )
    `)
    .eq('event_id', eventId)
    .eq('deal_stage', 'Confirmed')
    .not('company_id', 'is', null)
    .not('package_name', 'is', null);

  if (error) {
    console.error('Error loading event sponsors:', error);
    return [];
  }

  if (!deals || deals.length === 0) {
    return [];
  }

  // Get all company IDs
  const companyIds = [
    ...new Set(
      deals
        .map((deal: any) => deal.company_id)
        .filter(Boolean)
    )
  ];

  // Reuse your existing logo function
  const logos = await getLogosByIds(companyIds);

  // Build the final sponsor objects
  return deals
    .filter((deal: any) => logos[deal.company_id])
    .map((deal: any) => ({
      company_id: deal.company_id,
      company_name:
        deal.companies?.company_name || `Company ${deal.company_id}`,
      package_name: deal.package_name,
      logo: logos[deal.company_id],
    }));
}