import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
const COOKIE='bancee_admin';
function secret(){return process.env.ADMIN_SECRET || 'dev-admin-change-me'}
function signature(){return createHmac('sha256',secret()).update('admin-session').digest('hex')}
export function validAdminPassword(value:string){const a=Buffer.from(value);const b=Buffer.from(secret());return a.length===b.length && timingSafeEqual(a,b)}
export async function isAdmin(){const c=await cookies();return c.get(COOKIE)?.value===signature()}
export async function setAdminCookie(){const c=await cookies();c.set(COOKIE,signature(),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12})}
export async function clearAdminCookie(){const c=await cookies();c.delete(COOKIE)}
