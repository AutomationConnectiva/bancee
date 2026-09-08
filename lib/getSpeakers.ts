import { supabase } from './supabase';
import type { Speaker } from '../components/SpeakerGrid';

function toDirectDriveUrl(url: string) {
  const match = url.match(/\/d\/(.+?)\//);
  return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
}

export async function getSpeakers(context: 'expo' | 'summit' | 'advisory'): Promise<Speaker[]> {
  const visibilityColumn = context === 'expo' ? 'show_on_expo' : context === 'summit' ? 'show_on_summit' : 'show_on_advisory';
  const orderColumn = context === 'expo' ? 'display_order' : context === 'summit' ? 'display_order_summit' : 'display_order_advisory';

  let query = supabase
    .from('speakers')
    .select(`
      full_name,
      job,
      link_photo,
      advisory_photo,
      display_order,
      display_order_summit,
      display_order_advisory,
      companies ( company_name )
    `)
    .eq(visibilityColumn, true);

  if (context === 'summit') {
    query = query.eq('summit_year', 2026);
  }

  const { data, error } = await query.order(orderColumn, { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching speakers:', error);
    return [];
  }

  return data.map((s: any) => {
    const photoSource = context === 'advisory' ? s.advisory_photo : s.link_photo;
    return {
      name: s.full_name,
      title: s.job ?? '',
      org: s.companies?.company_name ?? '',
      image: photoSource ? toDirectDriveUrl(photoSource) : '/images/placeholder-speaker.jpg',
    };
  });
}