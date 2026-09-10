import { supabaseAdmin } from './supabase';

export async function logSubmission(source: string, data: Record<string, any>) {
  const { error } = await supabaseAdmin.from('form_submissions').insert({
    source,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    company: data.organisation ?? data.company,
    job_title: data.jobTitle,
    phone: data.phone,
    country: data.country,
    message: data.message,
    details: data,
  });
  if (error) console.error('form_submissions insert failed:', error);
}