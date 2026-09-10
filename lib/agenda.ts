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

// Keyed by `${day}|${stage}` — shown once, before that stage's first module.
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
// Keyed by `${day}|${stage}|${normalizedModuleTheme}` — shown right after
// that specific module ends, before the next one starts.
const MODULE_AFTER: Record<string, { time: string; title: string }[]> = {
  // Day 1 — Main Stage
  [`day1|main|${normalizeName('Tech & Innovation')}`]: [
    { time: '10:45', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day1|main|${normalizeName('Regulatory Landscape')}`]: [
    { time: '12:55', title: 'Lunch Break, Networking & 1-to-1 Meetings' },
  ],

  // Day 1 — Digital Stage
  [`day1|digital|${normalizeName('Digital Infrastructure')}`]: [
    { time: '15:35', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day1|digital|${normalizeName('Core Transformation')}`]: [
    { time: '17:45', title: 'End of Day 1, Networking & 1-to-1 Meetings' },
    { time: '18:30', title: 'Cocktail Reception & Gala Dinner' },
  ],

  // Day 1 — Impact Stage
  [`day1|impact|${normalizeName('Next-Gen Payments')}`]: [
    { time: '15:35', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day1|impact|${normalizeName('Fraud & Financial Crime')}`]: [
    { time: '17:45', title: 'End of Day 1, Networking & 1-to-1 Meetings' },
    { time: '18:30', title: 'Cocktail Reception & Gala Dinner' },
  ],

  // Day 2 — Main Stage
  [`day2|main|${normalizeName('Risk, AI, and Strategy')}`]: [
    { time: '15:35', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day2|main|${normalizeName('Leadership & Transformation')}`]: [
    { time: '17:45', title: 'Farewell & See You at the Next #BANCEE Events' },
  ],

  // Day 2 — Digital Stage
  [`day2|digital|${normalizeName('CX Personalization')}`]: [
    { time: '10:45', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day2|digital|${normalizeName('Lending Transformation')}`]: [
    { time: '12:55', title: 'Lunch Break, Networking & 1-to-1 Meetings' },
  ],

  // Day 2 — Impact Stage
  [`day2|impact|${normalizeName('Cybersecurity & Resilience')}`]: [
    { time: '10:45', title: 'Coffee Break, Networking & 1-to-1 Meetings' },
  ],
  [`day2|impact|${normalizeName('Global Payments & CEE')}`]: [
    { time: '12:55', title: 'Lunch Break, Networking & 1-to-1 Meetings' },
  ],
};

// Per-day stage tab order (Day 1: Main first; Day 2: Digital first).
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

// Cleans up CSV-export artifacts (stray leading/trailing quote) from the
// description column. Component renders this as a single paragraph, so if
// you want the "- point one / - point two" lines to actually break onto
// separate lines, add `white-space:pre-line` to `.agenda-session-description`.
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
// Main fetch
// ---------------------------------------------------------------------------
export async function getExpoAgenda(): Promise<AgendaDay[]> {
  // Ordering: `stage_day` (e.g. "MSD1M1") encodes stage + day + module number
  // directly in the code, so sorting on it keeps modules in the right order
  // even if rows are edited/inserted out of original sequence later — more
  // robust than relying on agenda_id insertion order. `position` is the
  // secondary sort, ordering sessions correctly *within* a module (K1→K2→P1).
  // Note: this is a plain string sort, so it assumes single-digit module
  // numbers (M1..M9); a module 10 would need zero-padding to sort correctly.
  const { data: rows, error } = await supabase
    .from('agenda')
    .select('*')
    .eq('event_id', 'BANCEE26')
    .order('stage_day', { ascending: true })
    .order('position', { ascending: true });

  if (error || !rows) {
    console.error('Agenda fetch failed', error);
    return [];
  }

  // --- Collect ids to resolve ---
  // speak_moderate -> speakers.presentation_id (used as plain speaker on
  // Keynote/Sponsored rows, and as the Moderator on Panel Discussion rows)
  const speakerIds = new Set<number>();
  // panelist[] -> people.person_id (Panelist role only)
  const personIds = new Set<number>();
  // sponsor -> companies.company_id
  const companyIds = new Set<number>();

  for (const r of rows as any[]) {
    if (r.speak_moderate) speakerIds.add(r.speak_moderate);
    if (Array.isArray(r.panelist)) r.panelist.forEach((id: number) => personIds.add(id));
    if (r.sponsor) companyIds.add(r.sponsor);
  }

const [{ data: speakers }, { data: people }] = await Promise.all([
  speakerIds.size
    ? supabase.from('speakers').select('presentation_id, full_name, job, company_id, link_photo').in('presentation_id', [...speakerIds])
    : Promise.resolve({ data: [] as any[] }),
  personIds.size
    ? supabase.from('people').select('person_id, first_name, last_name, job_title, company_id, image').in('person_id', [...personIds])
    : Promise.resolve({ data: [] as any[] }),
]);

// Now that we have speakers/people, add THEIR company_ids to the set too
for (const s of speakers || []) if (s.company_id) companyIds.add(s.company_id);
for (const p of people || []) if (p.company_id) companyIds.add(p.company_id);

const [{ data: companies }, { data: allSpeakerPhotos }] = await Promise.all([
  companyIds.size
    ? supabase.from('companies').select('company_id, company_name, image_url').in('company_id', [...companyIds])
    : Promise.resolve({ data: [] as any[] }),
  supabase.from('speakers').select('full_name, link_photo'),
]);

  const companyMap = new Map<number, any>((companies || []).map((c: any) => [c.company_id, c]));
  const speakerMap = new Map<number, any>((speakers || []).map((s: any) => [s.presentation_id, s]));
  const peopleMap = new Map<number, any>((people || []).map((p: any) => [p.person_id, p]));

  const speakerPhotoByName = new Map<string, string>();
  for (const s of allSpeakerPhotos || []) {
    if (s.link_photo) speakerPhotoByName.set(normalizeName(s.full_name), s.link_photo);
  }

  const speakerToPerson = (s: any, role: string): AgendaPerson => {
    const company = s.company_id ? companyMap.get(s.company_id) : null;
    return {
      id: s.presentation_id,
      name: s.full_name,
      title: s.job || '',
      company: company?.company_name || '',
      photo_url: directDrive(s.link_photo),
      role,
    };
  };

  const personToPerson = (p: any, role: string): AgendaPerson => {
    const company = p.company_id ? companyMap.get(p.company_id) : null;
    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.trim();
    const matchedSpeakerPhoto = speakerPhotoByName.get(normalizeName(fullName));
    return {
      id: p.person_id,
      name: fullName,
      title: p.job_title || '',
      company: company?.company_name || '',
      photo_url: directDrive(matchedSpeakerPhoto || p.image),
      role,
    };
  };

  // --- Build days/stages/modules/sessions ---
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
      // module_id (e.g. "M2K1") is NOT reliably unique even within a single
      // day+stage — the table reuses the same module_id values for a
      // different theme in the same day+stage (e.g. Main Stage Day 2 has
      // two separate themes that both use module_id "M2K1/M2K2/M2P1").
      // The theme is what's actually distinct, so key off that instead.
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

    // Sponsor: attach the first non-null sponsor found for this module.
    if (r.sponsor && !mod.sponsor) {
      const company = companyMap.get(r.sponsor);
      if (company) {
        mod.sponsor = { name: company.company_name, logo: directDrive(company.image_url) };
      }
    }

    const type = sessionType(r.module_type);

    // speak_moderate is a Speaker on Keynote/Sponsored rows, but becomes the
    // Moderator (pushed into panelists, not speakers) on Panel Discussion rows.
    const speakerPerson: AgendaPerson[] =
      type !== 'panel' && r.speak_moderate && speakerMap.has(r.speak_moderate)
        ? [speakerToPerson(speakerMap.get(r.speak_moderate), 'Speaker')]
        : [];

    const panelistPeople: AgendaPerson[] = [];

    if (type === 'panel' && r.speak_moderate && speakerMap.has(r.speak_moderate)) {
      panelistPeople.push(speakerToPerson(speakerMap.get(r.speak_moderate), 'Moderator'));
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