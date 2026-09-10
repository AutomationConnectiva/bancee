import { NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/attendance';
import { logSubmission } from '../../../lib/formLog';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const b = await req.json();
    for (const k of ['firstName','lastName','company','email','message']) {
      if (!b[k]) return NextResponse.json({ error: `Missing required field: ${k}` }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(String(b.email))) {
      return NextResponse.json({ error: 'Please enter a valid business email.' }, { status: 400 });
    }

    await logSubmission('contact', b);

    const approver = process.env.APPROVER_EMAIL || 'mohamad@connectiva.events';
    await sendEmail(approver, `New Contact Enquiry — ${b.interest}`, `<h2>New Contact Enquiry</h2><p><strong>${b.firstName} ${b.lastName}</strong><br>${b.jobTitle || ''}<br>${b.company}</p><p><strong>Email:</strong> ${b.email}<br><strong>Phone:</strong> ${b.phone || 'Not provided'}<br><strong>Interested in:</strong> ${b.interest}</p><p><strong>Message:</strong> ${b.message}</p>`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'We could not submit your message. Please try again.' }, { status: 500 });
  }
}