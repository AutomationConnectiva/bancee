import { supabase } from './supabase';

export type AgendaPerson = {
  id: number;
  name: string;
  title?: string;
  company?: string;
  photo_url?: string;
  role?: string; // 'Speaker' | 'Moderator' | 'Panelist'
};

export type AgendaSession = {
  agenda_id: number;
  time: string;
  end_time?: string;
  type: string;
  typeLabel: string;
  title: string;
  description?: string;
  discussionPoints?: string[];
  speakers: AgendaPerson[];
  panelists: AgendaPerson[];
};

export type AgendaModule = {
  module_id: string;
  title: string;
  sponsor?: { name: string; logo?: string } | null;
  sessions: AgendaSession[];
  after?: { time: string; title: string }[];
};

export type AgendaStage = {
  id: string;
  label: string;
  opening?: { time: string; title: string }[];
  modules: AgendaModule[];
};

export type AgendaDay = {
  id: string;
  label: string;
  date: string;
  stages: AgendaStage[];
};

export async function getEventModules(eventId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('agenda')
    .select('theme, agenda_id')
    .eq('event_id', eventId)
    .order('agenda_id', { ascending: true });

  if (error || !data) {
    console.error('Error fetching event modules', error);
    return [];
  }

  const seen = new Set<string>();
  const modules: string[] = [];
  for (const row of data as any[]) {
    if (row.theme && !seen.has(row.theme)) {
      seen.add(row.theme);
      modules.push(row.theme);
    }
  }
  return modules;
}

// ---------------------------------------------------------------------------
// Static structural content — NOT in the `agenda` table (no source column
// for ceremony/break timings or the calendar date). Edit these directly;
// everything else below is fully DB-driven from Supabase.
// ---------------------------------------------------------------------------
const DAY_META: Record<string, { label: string; date: string }> = {
  day1: { label: 'DAY 1', date: '19 November 2026' },
  day2: { label: 'DAY 2', date: 'TBD' },
};

const STAGE_LABELS: Record<string, string> = {
  main: 'MAIN STAGE',
  digital: 'DIGITAL STAGE',
  impact: 'IMPACT STAGE',
  other: 'OTHER',
};

const STAGE_OPENING: Record<string, { time: string; title: string }[]> = {
  'day1|main': [
    { time: '08:30', title: 'Registration & Morning Coffee' },
    { time: '09:00', title: 'Welcome Remarks' },
  ],
  'day2|digital': [
    { time: '08:30', title: 'Registration & Morning Coffee' },
    { time: '09:00', title: 'Welcome Remarks' },
  ],
  'day2|impact': [
    { time: '08:30', title: 'Registration & Morning Coffee' },
    { time: '09:00', title: 'Welcome Remarks' },
  ],
};

const MODULE_AFTER: Record<string, { time: string; title: string }[]> = {
  [`day1|main|${normalizeName('Tech & Innovation')}`]: [
    { time: '10:45', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day1|main|${normalizeName('Regulatory Landscape')}`]: [
    { time: '12:55', title: 'Lunch Break, Networking & 1-to-1 Meetings' },
  ],
  [`day1|digital|${normalizeName('Digital Infrastructure')}`]: [
    { time: '15:35', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day1|digital|${normalizeName('Core Transformation')}`]: [
    { time: '17:45', title: 'End of Day 1, Networking & 1-to-1 Meetings' },
    { time: '18:30', title: 'Cocktail Reception & Gala Dinner' },
  ],
  [`day1|impact|${normalizeName('Next-Gen Payments')}`]: [
    { time: '15:35', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day1|impact|${normalizeName('Fraud & Financial Crime')}`]: [
    { time: '17:45', title: 'End of Day 1, Networking & 1-to-1 Meetings' },
    { time: '18:30', title: 'Cocktail Reception & Gala Dinner' },
  ],
  [`day2|main|${normalizeName('Risk, AI, and Strategy')}`]: [
    { time: '15:35', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day2|main|${normalizeName('Leadership & Transformation')}`]: [
    { time: '17:45', title: 'Farewell & See You at the Next #BANCEE Events' },
  ],
  [`day2|digital|${normalizeName('CX Personalization')}`]: [
    { time: '10:45', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day2|digital|${normalizeName('Lending Transformation')}`]: [
    { time: '12:55', title: 'Lunch Break, Networking & 1-to-1 Meetings' },
  ],
  [`day2|impact|${normalizeName('Cybersecurity & Resilience')}`]: [
    { time: '10:45', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day2|impact|${normalizeName('Global Payments & CEE')}`]: [
    { time: '12:55', title: 'Lunch Break, Networking & 1-to-1 Meetings' },
  ],
};

const STAGE_ORDER_BY_DAY: Record<string, string[]> = {
  day1: ['main', 'digital', 'impact', 'other'],
  day2: ['digital', 'impact', 'main', 'other'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function directDrive(url?: string | null) {
  if (!url) return '';
  const m = url.match(/\/d\/(.+?)\//);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : url;
}

function formatTime(t?: string | null) {
  if (!t) return '';
  return t.slice(0, 5);
}

function sessionType(label?: string | null) {
  const x = (label || '').toLowerCase();
  return x.startsWith('panel') ? 'panel' : x.startsWith('sponsor') ? 'sponsored' : 'keynote';
}

function parseStageDay(code: string) {
  const c = (code || '').toUpperCase();
  const day = c.includes('D2') ? 'day2' : 'day1';
  const stage = c.startsWith('MS') ? 'main' : c.startsWith('DS') ? 'digital' : c.startsWith('IS') ? 'impact' : 'other';
  return { day, stage };
}

function normalizeName(s: string) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function cleanDescription(text: any): string | undefined {
  const x = String(text ?? '').trim();
  if (!x || x === '….' || x === '...') return undefined;
  return x.replace(/^"+|"+$/g, '').trim() || undefined;
}

function parsePoints(text: any): string[] | undefined {
  const x = String(text ?? '').trim();
  if (!x || x === '….' || x === '...') return undefined;
  const pts = x
    .replace(/^"+|"+$/g, '')
    .split(/\r?\n|(?<=\S)\s*-\s+(?=[A-Z])/)
    .map((y) => y.trim().replace(/^[-•]\s*/, ''))
    .filter(Boolean);
  return pts.length ? pts : undefined;
}

// ---------------------------------------------------------------------------
// Main fetch — speak_moderate and panelist[] BOTH reference people.person_id
// (the `speakers` table has been retired)
// ---------------------------------------------------------------------------
export async function getExpoAgenda(eventId: string = 'BANCEE26'): Promise<AgendaDay[]> {
  const { data: rows, error } = await supabase
    .from('agenda')
    .select('*')
    .eq('event_id', eventId)
    .order('stage_day', { ascending: true })
    .order('position', { ascending: true });

  if (error || !rows) {
    console.error('Agenda fetch failed', error);
    return [];
  }

  const personIds = new Set<number>();
  const companyIds = new Set<number>();

  for (const r of rows as any[]) {
    if (r.speak_moderate) personIds.add(r.speak_moderate);
    if (Array.isArray(r.panelist)) r.panelist.forEach((id: number) => personIds.add(id));
    if (r.sponsor) companyIds.add(r.sponsor);
  }

  const { data: people } = personIds.size
    ? await supabase.from('people').select('person_id, first_name, last_name, job_title, company_id, image').in('person_id', [...personIds])
    : { data: [] as any[] };

  for (const p of people || []) if (p.company_id) companyIds.add(p.company_id);

  const { data: companies } = companyIds.size
    ? await supabase.from('companies').select('company_id, company_name, image_url').in('company_id', [...companyIds])
    : { data: [] as any[] };

  const companyMap = new Map<number, any>((companies || []).map((c: any) => [c.company_id, c]));
  const peopleMap = new Map<number, any>((people || []).map((p: any) => [p.person_id, p]));

  const personToPerson = (p: any, role: string): AgendaPerson => {
    const company = p.company_id ? companyMap.get(p.company_id) : null;
    return {
      id: p.person_id,
      name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
      title: p.job_title || '',
      company: company?.company_name || '',
      photo_url: directDrive(p.image),
      role,
    };
  };

  const dayMap = new Map<string, AgendaDay>();

  for (const r of rows as any[]) {
    const { day, stage } = parseStageDay(r.stage_day);

    if (!dayMap.has(day)) {
      const meta = DAY_META[day] || { label: day, date: '' };
      dayMap.set(day, { id: day, label: meta.label, date: meta.date, stages: [] });
    }
    const d = dayMap.get(day)!;

    let st = d.stages.find((s) => s.id === stage);
    if (!st) {
      st = { id: stage, label: STAGE_LABELS[stage] || stage, opening: STAGE_OPENING[`${day}|${stage}`], modules: [] };
      d.stages.push(st);
    }

    let mod = st.modules.find((m) => m.title === (r.theme || ''));
    if (!mod) {
      const afterKey = `${day}|${stage}|${normalizeName(r.theme)}`;
      mod = {
        module_id: `${day}-${stage}-${normalizeName(r.theme)}`,
        title: r.theme || '',
        sponsor: null,
        sessions: [],
        after: MODULE_AFTER[afterKey],
      };
      st.modules.push(mod);
    }

    if (r.sponsor && !mod.sponsor) {
      const company = companyMap.get(r.sponsor);
      if (company) {
        mod.sponsor = { name: company.company_name, logo: directDrive(company.image_url) };
      }
    }

    const type = sessionType(r.module_type);

    const speakerPerson: AgendaPerson[] =
      type !== 'panel' && r.speak_moderate && peopleMap.has(r.speak_moderate)
        ? [personToPerson(peopleMap.get(r.speak_moderate), 'Speaker')]
        : [];

    const panelistPeople: AgendaPerson[] = [];

    if (type === 'panel' && r.speak_moderate && peopleMap.has(r.speak_moderate)) {
      panelistPeople.push(personToPerson(peopleMap.get(r.speak_moderate), 'Moderator'));
    }

    if (Array.isArray(r.panelist)) {
      for (const pid of r.panelist) {
        if (peopleMap.has(pid)) panelistPeople.push(personToPerson(peopleMap.get(pid), 'Panelist'));
      }
    }

    mod.sessions.push({
      agenda_id: r.agenda_id,
      time: formatTime(r.start_time),
      end_time: formatTime(r.end_time),
      type,
      typeLabel: r.module_type || '',
      title: r.title || '',
      description: cleanDescription(r.description),
      discussionPoints: parsePoints(r.description),
      speakers: speakerPerson,
      panelists: panelistPeople,
    });
  }

  const dayOrder = ['day1', 'day2'];
  const days = [...dayMap.values()].sort((a, b) => dayOrder.indexOf(a.id) - dayOrder.indexOf(b.id));
  for (const d of days) {
    const order = STAGE_ORDER_BY_DAY[d.id] || ['main', 'digital', 'impact', 'other'];
    d.stages.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }

  return days;
}