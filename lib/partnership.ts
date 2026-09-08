import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { sendEmail } from './attendance';
export type PartnershipLead={id:string;firstName:string;lastName:string;jobTitle:string;organisation:string;email:string;phone?:string;country:string;website?:string;interests:string[];objectives:string[];expertise:string[];message?:string;source?:string;eventContext?:string;utmSource?:string;utmMedium?:string;utmCampaign?:string;referrer?:string;status:'new'|'contacted'|'in_discussion'|'won'|'lost';submittedAt:string};
const file=path.join(process.cwd(),'data','partnership-enquiries.json');
async function ensure(){await fs.mkdir(path.dirname(file),{recursive:true});try{await fs.access(file)}catch{await fs.writeFile(file,'[]','utf8')}}
export async function readPartnerships():Promise<PartnershipLead[]>{await ensure();return JSON.parse(await fs.readFile(file,'utf8'))}
export async function writePartnerships(x:PartnershipLead[]){await ensure();await fs.writeFile(file,JSON.stringify(x,null,2),'utf8')}
export function partnershipId(){return `partner_${Date.now()}_${randomBytes(5).toString('hex')}`}
export async function notifyPartnership(lead:PartnershipLead){const to=process.env.PARTNERSHIP_EMAIL||process.env.APPROVER_EMAIL||'mohamad@connectiva.events';await sendEmail(to,`New Partnership Enquiry — ${lead.organisation}`,`<h2>New Partnership Enquiry</h2><p><strong>${lead.firstName} ${lead.lastName}</strong><br>${lead.jobTitle}<br>${lead.organisation} · ${lead.country}</p><p><strong>Email:</strong> ${lead.email}<br><strong>Phone:</strong> ${lead.phone||'Not provided'}<br><strong>Website:</strong> ${lead.website||'Not provided'}<br><strong>Source:</strong> ${lead.source||'website'}<br><strong>UTM:</strong> ${lead.utmSource||'—'} / ${lead.utmMedium||'—'} / ${lead.utmCampaign||'—'}</p><p><strong>Partnership interest:</strong><br>${lead.interests.join('<br>')}</p><p><strong>Objectives:</strong><br>${lead.objectives.join('<br>')}</p><p><strong>Solutions & expertise:</strong><br>${lead.expertise.join('<br>')}</p>${lead.message?`<p><strong>Additional information:</strong><br>${lead.message}</p>`:''}`)}
