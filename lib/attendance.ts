import { createHmac, randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export type AttendanceRequest = {
  id: string;
  event: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  organisation: string;
  email: string;
  country: string;
  linkedin?: string;
  message?: string;
  source?: string;
  status: 'under_review' | 'approved' | 'sponsorship_opportunity' | 'declined';
  submittedAt: string;
  reviewedAt?: string;
  registrationToken?: string;
};

const dataDir = path.join(process.cwd(), 'data');
const requestsFile = path.join(dataDir, 'attendance-requests.json');
const outboxFile = path.join(dataDir, 'email-outbox.json');

async function ensureDataFile(file: string) {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(file); } catch { await fs.writeFile(file, '[]', 'utf8'); }
}

export async function readRequests(): Promise<AttendanceRequest[]> {
  await ensureDataFile(requestsFile);
  return JSON.parse(await fs.readFile(requestsFile, 'utf8'));
}

export async function writeRequests(items: AttendanceRequest[]) {
  await ensureDataFile(requestsFile);
  await fs.writeFile(requestsFile, JSON.stringify(items, null, 2), 'utf8');
}

export function createRequestId() {
  return `ar_${Date.now()}_${randomBytes(5).toString('hex')}`;
}

function secret() {
  return process.env.APPROVAL_SECRET || 'dev-only-change-this-secret';
}

export function createDecisionToken(id: string, action: 'approve' | 'sponsorship' | 'decline', expires: number) {
  const payload = `${id}.${action}.${expires}`;
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export function verifyDecisionToken(id: string, action: 'approve' | 'sponsorship' | 'decline', expires: number, token: string) {
  if (Date.now() > expires) return false;
  return createDecisionToken(id, action, expires) === token;
}

export function createRegistrationToken() {
  return randomBytes(32).toString('hex');
}

export async function sendEmail(to: string, subject: string, html: string) {
  const from = process.env.EMAIL_FROM || 'Banking CEE Network <info@bancee.eu>';
  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, html })
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
    return;
  }
  await ensureDataFile(outboxFile);
  const outbox = JSON.parse(await fs.readFile(outboxFile, 'utf8'));
  outbox.push({ to, from, subject, html, createdAt: new Date().toISOString(), mode: 'development-outbox' });
  await fs.writeFile(outboxFile, JSON.stringify(outbox, null, 2), 'utf8');
}

export function eventLabel(event: string) {
  if (event === 'expo-2026') return 'Banking CEE Expo 2026';
  if (event === 'summit-2027') return 'Digital Banking CEE Summit 2027';
  return 'Banking CEE';
}
