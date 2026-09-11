import { supabaseAdmin } from './supabaseAdmin';

export async function logSubmission(source: string, data: Record<string, any>) {
  const { error } = await supabaseAdmin.from('form_submissions').insert({
    source,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    job_title: data.jobTitle,
    company: data.organisation ?? data.company,
    country: data.country,
    website: data.website,
    message: data.message,
    partnership_interests: data.interests,
    partnership_objectives: data.objectives,
    partnership_expertise: data.expertise,
    event_name: data.event,
    utm_source: data.utmSource,
    utm_medium: data.utmMedium,
    utm_campaign: data.utmCampaign,
    referrer: data.referrer,
  });
  if (error) console.error('form_submissions insert failed:', error);
}