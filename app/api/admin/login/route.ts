import { NextResponse } from 'next/server';import {setAdminCookie,validAdminPassword} from '../../../../lib/admin';
export async function POST(req:Request){const b=await req.json();if(!validAdminPassword(String(b.password||'')))return NextResponse.json({error:'Invalid password'},{status:401});await setAdminCookie();return NextResponse.json({ok:true})}
