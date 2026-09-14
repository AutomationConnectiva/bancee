import { supabaseAdmin } from './supabaseAdmin';

export async function logSubmission(source: string, data: Record<string, any>) {
  console.log('=== logSubmission CALLED ===', source);
  const { error, data: inserted } = await supabaseAdmin.from('form_submissions').insert({
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
    linkedin: data.linkedin,
    partnership_interests: data.interests,
    partnership_objectives: data.objectives,
    partnership_expertise: data.expertise,
    event_name: data.event,
    speaker_topics: data.topics,
    speaker_contributions: data.contributions,
    proposed_topic: data.topic,
  }).select();
  console.log('=== INSERT RESULT ===', JSON.stringify({ error, inserted }));
}