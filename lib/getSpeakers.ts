import { supabase } from './supabase';
import type { Speaker } from '../components/SpeakerGrid';

function toDirectDriveUrl(url: string) {
  const match = url.match(/\/d\/(.+?)\//);
  return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
}

export async function getActiveEventIds(): Promise<{ expo: string | null; summit: string | null }> {
  const { data, error } = await supabase
    .from('systems_tables')
    .select('config1, config2')
    .eq('system_name', 'active_events')
    .single();
  if (error || !data) {
    console.error('Failed to fetch active event config', error);
    return { expo: null, summit: null };
  }
  return { expo: data.config1, summit: data.config2 };
}

export async function getEventSpeakers(eventId: string): Promise<Speaker[]> {
  const { data: participants, error: partError } = await supabase
    .from('event_participants')
    .select('person_id, display_order')
    .eq('event_id', eventId)
    .eq('status', 'Confirmed')
    .in('role', ['Speaker', 'Moderator', 'Panelist'])
    .order('display_order', { ascending: true, nullsFirst: false });

  if (partError || !participants || participants.length === 0) {
    console.error('Error fetching event participants:', partError);
    return [];
  }

  const personIds = participants.map((p: any) => p.person_id);

  const { data: people, error: peopleError } = await supabase
    .from('people')
    .select('person_id, first_name, last_name, job_title, image, company_id')
    .in('person_id', personIds);

  if (peopleError || !people) {
    console.error('Error fetching people:', peopleError);
    return [];
  }

  const companyIds = people.map((p: any) => p.company_id).filter(Boolean);
  const { data: companies } = await supabase
    .from('companies')
    .select('company_id, company_name')
    .in('company_id', companyIds.length ? companyIds : [0]);

  const companyMap = new Map((companies || []).map((c: any) => [c.company_id, c.company_name]));
  const peopleMap = new Map(people.map((p: any) => [p.person_id, p]));

  return participants
    .map((part: any) => peopleMap.get(part.person_id))
    .filter(Boolean)
    .map((p: any) => ({
      name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
      title: p.job_title ?? '',
      org: p.company_id ? (companyMap.get(p.company_id) ?? '') : '',
      image: p.image ? toDirectDriveUrl(p.image) : '/images/placeholder-speaker.jpg',
    }));
}

export async function getAdvisors(): Promise<Speaker[]> {
  const { data, error } = await supabase
    .from('people')
    .select(`
      first_name,
      last_name,
      job_title,
      image,
      abm_order,
      companies ( company_name )
    `)
    .eq('lead_purpose', 'ABM')
    .order('abm_order', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching advisors:', error);
    return [];
  }

  return data.map((p: any) => ({
    name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
    title: p.job_title ?? '',
    org: p.companies?.company_name ?? '',
    image: p.image ? toDirectDriveUrl(p.image) : '/images/placeholder-speaker.jpg',
  }));
}