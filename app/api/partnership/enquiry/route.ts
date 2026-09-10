import { NextResponse } from 'next/server';
import { notifyPartnership, partnershipId, readPartnerships, writePartnerships } from '../../../../lib/partnership';
import { sendEmail } from '../../../../lib/attendance';
import { logSubmission } from '../../../../lib/formLog';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const b = await req.json();
    for (const k of ['firstName','lastName','jobTitle','organisation','email','country']) {
      if (!b[k]) return NextResponse.json({ error: `Missing required field: ${k}` }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(String(b.email))) {
      return NextResponse.json({ error: 'Please enter a valid business email.' }, { status: 400 });
    }

    // 1. Build the formatted lead object
    const lead = {
      id: partnershipId(), 
      firstName: String(b.firstName).trim(), 
      lastName: String(b.lastName).trim(), 
      jobTitle: String(b.jobTitle).trim(), 
      organisation: String(b.organisation).trim(), 
      email: String(b.email).trim(), 
      phone: b.phone ? String(b.phone).trim() : undefined, 
      country: String(b.country).trim(), 
      website: b.website ? String(b.website).trim() : undefined, 
      interests: Array.isArray(b.interests) ? b.interests : [], 
      objectives: Array.isArray(b.objectives) ? b.objectives : [], 
      expertise: Array.isArray(b.expertise) ? b.expertise : [], 
      message: b.message ? String(b.message).trim() : undefined, 
      source: b.source || 'website', 
      eventContext: b.eventContext || undefined, 
      utmSource: b.utmSource || undefined, 
      utmMedium: b.utmMedium || undefined, 
      utmCampaign: b.utmCampaign || undefined, 
      referrer: b.referrer || undefined, 
      status: 'new' as const, 
      submittedAt: new Date().toISOString()
    };

    // 2. Write submission to local database / storage
    const all = await readPartnerships(); 
    all.push(lead); 
    await writePartnerships(all);
    await logSubmission('partnership_enquiry', lead);

    // 3. Trigger webhook without returning early if set
    if (process.env.MAKE_PARTNERSHIP_WEBHOOK_URL) {
      const payload = { form_type: 'partnership_enquiry', status: 'NEW', submitted_at: lead.submittedAt, ...b };
      const hook = await fetch(process.env.MAKE_PARTNERSHIP_WEBHOOK_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      if (!hook.ok) throw new Error(`Make partnership webhook returned ${hook.status}`);
    }

    // 4. Send email notifications
    await notifyPartnership(lead);
    await sendEmail(
      lead.email, 
      'Thank you for your interest in partnering with Banking CEE', 
      `<p>Hi ${lead.firstName},</p><p>Thank you for your interest in exploring partnership opportunities with Banking CEE.</p><p>We've received your enquiry and will review the information you shared. A member of the Connectiva team will be in touch to discuss the opportunities most relevant to your objectives.</p><p>Kind regards,<br>Connectiva Team<br>Banking CEE Network</p>`
    );

    return NextResponse.json({ ok: true, message: 'Thank you. Your partnership enquiry has been received and our team will be in touch.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'We could not submit your enquiry. Please try again.' }, { status: 500 });
  }
}