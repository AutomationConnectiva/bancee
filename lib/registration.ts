import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { sendEmail, eventLabel } from './attendance';

export type ParticipantType = 'delegate'|'speaker'|'sponsor'|'association'|'media';
export type Registration = {
  id:string; token?:string; inviteCode?:string; participantType:ParticipantType; event:string;
  firstName:string; lastName:string; jobTitle:string; organisation:string; email:string; mobile?:string; country:string; linkedin?:string;
  interests:string[]; networking:boolean; meetingTypes:string[]; discussionTopics:string[]; marketing:boolean;
  bio?:string; photoUrl?:string; status:'registered'; registeredAt:string;
};
export type Campaign = { code:string; name:string; event:string; participantType:ParticipantType; capacity:number; used:number; approvalRequired:boolean; active:boolean; expiresAt?:string };
export type Allocation = { code:string; name:string; event:string; organisation:string; participantType:ParticipantType; capacity:number; used:number; active:boolean; expiresAt?:string };
export type SpeakerInvite = { code:string; event:string; organisation?:string; personName?:string; email?:string; used:boolean; active:boolean; expiresAt?:string };

const dataDir=path.join(process.cwd(),'data');
const registrationsFile=path.join(dataDir,'registrations.json');
const campaignsFile=path.join(dataDir,'campaigns.json');
const allocationsFile=path.join(dataDir,'allocations.json');
const speakerInvitesFile=path.join(dataDir,'speaker-invites.json');
async function ensure(file:string, initial='[]'){await fs.mkdir(dataDir,{recursive:true});try{await fs.access(file)}catch{await fs.writeFile(file,initial,'utf8')}}
async function readJson<T>(file:string,initial='[]'):Promise<T>{await ensure(file,initial);return JSON.parse(await fs.readFile(file,'utf8'))}
async function writeJson(file:string,x:unknown){await ensure(file);await fs.writeFile(file,JSON.stringify(x,null,2),'utf8')}
export async function readRegistrations():Promise<Registration[]>{return readJson(registrationsFile)}
export async function writeRegistrations(x:Registration[]){return writeJson(registrationsFile,x)}
export async function readCampaigns():Promise<Campaign[]>{return readJson(campaignsFile,JSON.stringify([{code:'final50-demo',name:'Expo 2026 — Final 50 Places',event:'expo-2026',participantType:'delegate',capacity:50,used:0,approvalRequired:false,active:true}],null,2))}
export async function writeCampaigns(x:Campaign[]){return writeJson(campaignsFile,x)}
export async function readAllocations():Promise<Allocation[]>{return readJson(allocationsFile)}
export async function writeAllocations(x:Allocation[]){return writeJson(allocationsFile,x)}
export async function readSpeakerInvites():Promise<SpeakerInvite[]>{return readJson(speakerInvitesFile)}
export async function writeSpeakerInvites(x:SpeakerInvite[]){return writeJson(speakerInvitesFile,x)}
export function registrationId(){return `reg_${Date.now()}_${randomBytes(4).toString('hex')}`}
export function secureCode(prefix='inv'){return `${prefix}_${randomBytes(18).toString('hex')}`}
export async function sendConfirmation(r:Registration){await sendEmail(r.email,`Registration Confirmed — ${eventLabel(r.event)}`,`<p>Hi ${r.firstName},</p><p>Thank you for confirming your participation in <strong>${eventLabel(r.event)}</strong>.</p><p>Your registration is confirmed.</p><p>We look forward to welcoming you.</p><p>Banking CEE Network</p>`)}
