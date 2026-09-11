import { NextResponse } from 'next/server';
import { createDecisionToken, createRequestId, eventLabel, readRequests, sendEmail, writeRequests } from '../../../../lib/attendance';
import { historyHtml, readPeople, findPerson, upsertPerson } from '../../../../lib/community';
import { logSubmission } from '../../../../lib/formLog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ['event','firstName','lastName','jobTitle','organisation','email','country'];
    for (const key of required) if (!body[key] || String(body[key]).trim() === '') return NextResponse.json({ error: `Missing required field: ${key}` }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(body.email)) return NextResponse.json({ error: 'Please enter a valid business email.' }, { status: 400 });

    if (process.env.MAKE_ATTENDANCE_WEBHOOK_URL) {
      await logSubmission('attendance_request', body); // ADDED
      const payload = { form_type: 'attendance_request', status: 'REQUESTED', submitted_at: new Date().toISOString(), ...body };
      const hook = await fetch(process.env.MAKE_ATTENDANCE_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!hook.ok) throw new Error(`Make attendance webhook returned ${hook.status}`);
      return NextResponse.json({ ok: true, message: 'Our team will review your request and get back to you shortly. Submitting a request does not automatically confirm attendance.' });
    }

    const item = {
      id: createRequestId(), event: body.event, firstName: String(body.firstName).trim(), lastName: String(body.lastName).trim(), jobTitle: String(body.jobTitle).trim(), organisation: String(body.organisation).trim(), email: String(body.email).trim(), country: String(body.country).trim(), linkedin: body.linkedin ? String(body.linkedin).trim() : undefined, message: body.message ? String(body.message).trim() : undefined, source: body.source || 'website', status: 'under_review' as const, submittedAt: new Date().toISOString()
    };
    const all = await readRequests(); all.push(item); await writeRequests(all);
    await logSubmission(item.event === 'summit-2027' ? 'summit_request_attendance' : 'expo_request_attendance', item);    const people = await readPeople(); const existingPerson = findPerson(people,item); await upsertPerson(item);

    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const expires = Date.now() + 1000 * 60 * 60 * 48;
    const approve = `${base}/api/attendance/review?id=${encodeURIComponent(item.id)}&action=approve&expires=${expires}&token=${createDecisionToken(item.id,'approve',expires)}`;
    const sponsorship = `${base}/api/attendance/review?id=${encodeURIComponent(item.id)}&action=sponsorship&expires=${expires}&token=${createDecisionToken(item.id,'sponsorship',expires)}`;
    const decline = `${base}/api/attendance/review?id=${encodeURIComponent(item.id)}&action=decline&expires=${expires}&token=${createDecisionToken(item.id,'decline',expires)}`;
    const approver = process.env.APPROVER_EMAIL || 'mohamad@connectiva.events';

    await sendEmail(approver, `New Attendance Request — ${eventLabel(item.event)}`, `<h2>New Attendance Request — ${eventLabel(item.event)}</h2><p><strong>${item.firstName} ${item.lastName}</strong><br>${item.jobTitle}<br>${item.organisation} · ${item.country}</p>${historyHtml(existingPerson)}<p><strong>Email:</strong> ${item.email}<br><strong>LinkedIn:</strong> ${item.linkedin ? `<a href="${item.linkedin}">View Profile</a>` : 'Not provided'}<br><strong>Source:</strong> ${item.source}</p>${item.message ? `<p><strong>Note:</strong> ${item.message}</p>` : ''}<p><a href="${approve}" style="padding:12px 18px;background:#53ef7a;color:#071b35;text-decoration:none;font-weight:700">APPROVE PARTICIPATION</a>&nbsp;&nbsp;<a href="${sponsorship}" style="padding:12px 18px;background:#dce9ff;color:#071b35;text-decoration:none;font-weight:700">SPONSORSHIP OPPORTUNITY</a>&nbsp;&nbsp;<a href="${decline}" style="padding:12px 18px;background:#eceff2;color:#071b35;text-decoration:none;font-weight:700">DECLINE / NOT QUALIFIED</a></p>`);
    await sendEmail(item.email, `Attendance Request Received — ${eventLabel(item.event)}`, `<p>Hi ${item.firstName},</p><p>Thank you for your interest in ${eventLabel(item.event)}. Our team will review your request and get back to you shortly.</p><p>Submitting a request does not automatically confirm attendance.</p><p>Banking CEE Network</p>`);

    return NextResponse.json({ ok: true, message: 'Our team will review your request and get back to you shortly. Submitting a request does not automatically confirm attendance.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'We could not submit your request. Please try again.' }, { status: 500 });
  }
}