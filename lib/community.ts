import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

export type CommunityPerson = {
  id:string; firstName:string; lastName:string; jobTitle?:string; organisation:string; email?:string; country?:string; linkedin?:string;
  participation: { event:string; year?:number; participationType:string; attendanceStatus?:string }[];
  createdAt:string; updatedAt:string;
};
const file=path.join(process.cwd(),'data','people.json');
async function ensure(){await fs.mkdir(path.dirname(file),{recursive:true});try{await fs.access(file)}catch{await fs.writeFile(file,'[]','utf8')}}
export async function readPeople():Promise<CommunityPerson[]>{await ensure();return JSON.parse(await fs.readFile(file,'utf8'))}
export async function writePeople(x:CommunityPerson[]){await ensure();await fs.writeFile(file,JSON.stringify(x,null,2),'utf8')}
const norm=(s?:string)=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
export function findPerson(people:CommunityPerson[], q:{email?:string;firstName?:string;lastName?:string;organisation?:string}){
  const email=norm(q.email); if(email){const p=people.find(x=>norm(x.email)===email);if(p)return p}
  return people.find(x=>norm(x.firstName)===norm(q.firstName)&&norm(x.lastName)===norm(q.lastName)&&norm(x.organisation)===norm(q.organisation));
}
export async function upsertPerson(input:Partial<CommunityPerson>&{firstName:string;lastName:string;organisation:string}){
  const people=await readPeople(); const now=new Date().toISOString(); let p=findPerson(people,input);
  if(p){p.jobTitle=input.jobTitle||p.jobTitle;p.email=input.email||p.email;p.country=input.country||p.country;p.linkedin=input.linkedin||p.linkedin;p.updatedAt=now}
  else {p={id:`person_${randomBytes(6).toString('hex')}`,firstName:input.firstName,lastName:input.lastName,organisation:input.organisation,jobTitle:input.jobTitle,email:input.email,country:input.country,linkedin:input.linkedin,participation:[],createdAt:now,updatedAt:now};people.push(p)}
  await writePeople(people);return p;
}
export function historyHtml(p?:CommunityPerson){if(!p||!p.participation.length)return '<p><strong>Banking CEE History:</strong><br>No previous Banking CEE participation found.</p>';return `<p><strong>Banking CEE History:</strong><br>${p.participation.map(x=>`${x.event}${x.year?` ${x.year}`:''} — ${x.participationType}${x.attendanceStatus?` (${x.attendanceStatus})`:''}`).join('<br>')}</p>`}
