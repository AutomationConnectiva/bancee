import { NextResponse } from 'next/server';
import { readRequests } from '../../../../lib/attendance';
import { readAllocations, readCampaigns, readRegistrations, readSpeakerInvites, registrationId, sendConfirmation, writeAllocations, writeCampaigns, writeRegistrations, writeSpeakerInvites } from '../../../../lib/registration';
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const b=await req.json();
  for(const k of ['firstName','lastName','jobTitle','organisation','email','country']) if(!b[k]) return NextResponse.json({error:`Missing ${k}`},{status:400});
  let participantType:any=b.mode==='speaker'||b.mode==='speaker-invite'?'speaker':'delegate';
  if(b.mode==='token'){
   const requests=await readRequests(); const found=requests.find(x=>x.registrationToken===b.tokenOrCode&&x.status==='approved');
   if(!found)return NextResponse.json({error:'This registration invitation is invalid or has been revoked.'},{status:403});
  }
  if(b.mode==='campaign'){
   const campaigns=await readCampaigns(); const i=campaigns.findIndex(x=>x.code===b.tokenOrCode&&x.active);
   if(i<0)return NextResponse.json({error:'Campaign invitation not found.'},{status:403}); const c=campaigns[i];
   if(c.expiresAt&&Date.now()>Date.parse(c.expiresAt))return NextResponse.json({error:'This campaign has expired.'},{status:403});
   if(c.used>=c.capacity)return NextResponse.json({error:'This campaign has reached capacity.'},{status:409});
   participantType=c.participantType;
  }
  if(b.mode==='allocation'){
   const allocations=await readAllocations(); const i=allocations.findIndex(x=>x.code===b.tokenOrCode&&x.active);
   if(i<0)return NextResponse.json({error:'Organisation invitation not found.'},{status:403}); const a=allocations[i];
   if(a.expiresAt&&Date.now()>Date.parse(a.expiresAt))return NextResponse.json({error:'This allocation has expired.'},{status:403});
   if(a.used>=a.capacity)return NextResponse.json({error:'This allocation has reached capacity.'},{status:409});
   participantType=a.participantType;
  }
  if(b.mode==='speaker-invite'){
   const invites=await readSpeakerInvites(); const i=invites.findIndex(x=>x.code===b.tokenOrCode&&x.active&&!x.used);
   if(i<0)return NextResponse.json({error:'This speaker invitation is invalid or has already been used.'},{status:403}); const s=invites[i];
   if(s.expiresAt&&Date.now()>Date.parse(s.expiresAt))return NextResponse.json({error:'This speaker invitation has expired.'},{status:403});
   participantType='speaker';
  }
  if(process.env.MAKE_REGISTRATION_WEBHOOK_URL){const hook=await fetch(process.env.MAKE_REGISTRATION_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({form_type:'completed_registration',participantType,submitted_at:new Date().toISOString(),...b})});if(!hook.ok)throw new Error(`Make registration webhook returned ${hook.status}`);return NextResponse.json({ok:true})}
  const all=await readRegistrations();
  if(all.some(x=>x.email.toLowerCase()===String(b.email).toLowerCase()&&x.event===b.event))return NextResponse.json({error:'A registration for this email and event already exists.'},{status:409});
  const r:any={id:registrationId(),token:b.mode==='token'?b.tokenOrCode:undefined,inviteCode:b.mode!=='token'&&b.mode!=='public'?b.tokenOrCode:undefined,participantType,event:b.event,firstName:b.firstName,lastName:b.lastName,jobTitle:b.jobTitle,organisation:b.organisation,email:b.email,mobile:b.mobile,country:b.country,website:b.website,linkedin:b.linkedin,interests:b.interests||[],goals:b.goals||[],companiesToMeet:[b.company1,b.company2,b.company3].filter(Boolean),profileMethod:b.profileMethod,profilePhotoFileName:b.profilePhotoFileName,photoUrl:b.photoUrl,bio:b.bio,profileVisible:!!b.profileVisible,attendanceDays:b.attendanceDays,gala:b.gala,heardAbout:b.heardAbout,marketing:!!b.marketing,privacy:!!b.privacy,status:'registered',registeredAt:new Date().toISOString()};
  all.push(r); await writeRegistrations(all);
  if(b.mode==='campaign'){const cs=await readCampaigns();const i=cs.findIndex(x=>x.code===b.tokenOrCode);if(i>=0){cs[i].used++;await writeCampaigns(cs)}}
  if(b.mode==='allocation'){const as=await readAllocations();const i=as.findIndex(x=>x.code===b.tokenOrCode);if(i>=0){as[i].used++;await writeAllocations(as)}}
  if(b.mode==='speaker-invite'){const ss=await readSpeakerInvites();const i=ss.findIndex(x=>x.code===b.tokenOrCode);if(i>=0){ss[i].used=true;await writeSpeakerInvites(ss)}}
  await sendConfirmation(r); return NextResponse.json({ok:true,id:r.id});
 }catch(e){console.error(e);return NextResponse.json({error:'Registration could not be completed.'},{status:500})}
}
