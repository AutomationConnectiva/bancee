'use client';
import {useState} from 'react';
import RegistrationForm from './RegistrationForm';
type EventId='expo-2026'|'summit-2027';
export default function PublicRegistration({initialEvent,source}:{initialEvent?:EventId;source?:string}){
 const [event,setEvent]=useState<EventId|undefined>(initialEvent);
 return <div className="public-registration">
  {!initialEvent&&<div className="public-registration-event-grid">
   <button type="button" className={event==='expo-2026'?'selected expo':''} onClick={()=>setEvent('expo-2026')}><span>Banking CEE Expo 2026</span><strong>19–20 November 2026</strong><small>Prague, Czechia</small><b>{event==='expo-2026'?'Selected ✓':'Register for Expo →'}</b></button>
   <button type="button" className={event==='summit-2027'?'selected summit':''} onClick={()=>setEvent('summit-2027')}><span>Digital Banking CEE Summit 2027</span><strong>May 2027</strong><small>Date &amp; Location TBA</small><b>{event==='summit-2027'?'Selected ✓':'Register for Summit →'}</b></button>
  </div>}
  {event?<RegistrationForm key={event} mode="public" event={event} source={source||'direct-registration'}/>:<div className="public-registration-placeholder">Choose an event above to open the full registration form.</div>}
 </div>
}
