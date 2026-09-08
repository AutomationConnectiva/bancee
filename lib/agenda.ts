import agendaFallback from '../data/expo-agenda-2026.json';
import { supabase } from './supabase';

type AgendaPerson = { speaker_id?:string; name:string; title?:string; company?:string; photo_url?:string; role?:string };
export type AgendaSession = { time:string; type:string; typeLabel:string; title:string; speakers:AgendaPerson[]; panelists:AgendaPerson[]; discussionPoints?:string[] };
export type AgendaModule = { title:string; sponsor?:string|null; sponsorLogo?:string; sessions:AgendaSession[]; after?:{time:string;title:string}[] };
export type AgendaStage = { id:string; label:string; opening?:{time:string;title:string}[]; modules:AgendaModule[] };
export type AgendaDay = { id:string; label:string; date:string; stages:AgendaStage[] };

const normalize=(s:string)=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=(s:any)=>String(s??'').replace(/\s+/g,' ').trim();
function directDrive(url:string){const m=url.match(/\/d\/(.+?)\//);return m?`https://lh3.googleusercontent.com/d/${m[1]}`:url;}
function formatTime(value:any){
  const raw=clean(value);if(!raw)return '';
  if(/^\d{1,2}:\d{1,2}$/.test(raw)){const [h,m]=raw.split(':');return `${h.padStart(2,'0')}:${m.padEnd(2,'0').slice(0,2)}`}
  if(/^\d{1,2}\.\d{1,2}$/.test(raw)){const [h,m]=raw.split('.');return `${h.padStart(2,'0')}:${m.padEnd(2,'0').slice(0,2)}`}
  if(/^\d{1,2}$/.test(raw))return `${raw.padStart(2,'0')}:00`;
  return raw.replace('.',':');
}
function sessionType(label:string){const x=label.toLowerCase();return x.startsWith('panel')?'panel':x.startsWith('sponsor')?'sponsored':'keynote'}
function parsePoints(text:any){const x=String(text||'').trim();if(!x||x==='….'||x==='...')return undefined;const pts=x.split(/\r?\n/).map(y=>y.trim().replace(/^[-•]\s*/,'' )).filter(Boolean);return pts.length?pts:undefined}
function parsePeople(value:any, panel=false):AgendaPerson[]{if(!value)return[];return String(value).split('|').map(clean).filter(Boolean).map(raw=>{const moderator=/\(\s*Moderator\s*\)/i.test(raw);const name=clean(raw.replace(/\s*\(\s*Moderator\s*\)\s*/ig,''));return{name,title:'',company:'',photo_url:'',role:panel?(moderator?'Moderator':'Panelist'):'Speaker'}})}
function assignSpeakerIds(people:AgendaPerson[],value:any){const ids=Array.isArray(value)?value.map(clean):String(value||'').split('|').map(clean).filter(Boolean);for(let i=0;i<people.length;i++)if(ids[i])people[i].speaker_id=ids[i];return people;}

function applyFlatAgendaRows(days:AgendaDay[],rows:any[]){
  if(!Array.isArray(rows)||!rows.length)return days;
  const byKey=new Map<string,AgendaModule>();
  for(const day of days)for(const stage of day.stages)for(const mod of stage.modules)byKey.set(`${day.id}|${stage.id}|${normalize(mod.title)}`,mod);
  for(const row of rows){
    if(clean(row.event_id||row.eventId||'BANCEE26')!=='BANCEE26')continue;
    const code=clean(row['Stage and Day']||row.stage_and_day||row.stageDay||'');
    const theme=clean(row.theme);if(!code||!theme)continue;
    const day=code.includes('D2')?'day2':'day1';
    const stage=code.startsWith('MS')?'main':code.startsWith('DS')?'digital':code.startsWith('IS')?'impact':'';
    const mod=byKey.get(`${day}|${stage}|${normalize(theme)}`);if(!mod)continue;
    const sponsor=clean(row.sponsor);mod.sponsor=sponsor||null;
    const title=clean(row.title);const time=formatTime(row.start_time||row.startTime);
    const session=mod.sessions.find(s=>normalize(s.title)===normalize(title))||mod.sessions.find(s=>s.time.replace(/^0/,'')===time.replace(/^0/,''));
    if(!session)continue;
    const label=clean(row.module_type||row.moduleType||session.typeLabel);
    session.title=title||session.title;session.time=time||session.time;session.typeLabel=label||session.typeLabel;session.type=sessionType(session.typeLabel);
    const points=parsePoints(row.description);if(points)session.discussionPoints=points;else if(session.type!=='panel')delete session.discussionPoints;
    session.speakers=assignSpeakerIds(parsePeople(row.speak_moderate||row.speakModerate,false),row.speaker_ids||row.speakerIds||row.speak_moderate_speaker_ids);
    session.panelists=assignSpeakerIds(parsePeople(row.panelist,true),row.panelist_speaker_ids||row.panelistSpeakerIds);
  }
  return days;
}

async function enrichSpeakerProfiles(days:AgendaDay[]){
  for(const day of days)for(const stage of day.stages)for(const mod of stage.modules)for(const session of mod.sessions)for(const person of [...session.speakers,...session.panelists]){
    if(person.photo_url?.startsWith('assets/speakers/'))person.photo_url='/images/agenda/speakers/'+person.photo_url.split('/').pop();
  }
  try{
    const {data:profiles,error}=await supabase.from('speakers').select(`id,full_name,job,link_photo,companies(company_name)`);
    if(error||!profiles)return days;
    const map=new Map<string,any>();const byId=new Map<string,any>();for(const p of profiles as any[]){map.set(normalize(p.full_name||''),p);if(p.id)byId.set(String(p.id),p)}
    for(const day of days)for(const stage of day.stages)for(const mod of stage.modules)for(const session of mod.sessions)for(const person of [...session.speakers,...session.panelists]){
      const p=(person.speaker_id&&byId.get(String(person.speaker_id)))||map.get(normalize(person.name));if(!p)continue;person.name=p.full_name||person.name;person.title=p.job||person.title||'';person.company=p.companies?.company_name||person.company||'';if(p.link_photo)person.photo_url=directDrive(p.link_photo);
    }
  }catch(e){console.error('Agenda speaker enrichment failed',e)}
  return days;
}

export async function getExpoAgenda():Promise<AgendaDay[]> {
  let days:AgendaDay[]=JSON.parse(JSON.stringify(agendaFallback));
  // Production-ready path: if IT uploads Agenda.xlsx rows to Supabase, keep the
  // table name as `agenda` or set AGENDA_TABLE. Missing table/RLS simply falls
  // back to the bundled latest approved Agenda.xlsx snapshot.
  try{
    const table=process.env.AGENDA_TABLE||'agenda';
    const {data,error}=await supabase.from(table).select('*').eq('event_id','BANCEE26');
    if(!error&&data?.length)days=applyFlatAgendaRows(days,data);
  }catch(e){console.error('Live agenda fetch failed; using approved fallback',e)}
  return enrichSpeakerProfiles(days);
}
