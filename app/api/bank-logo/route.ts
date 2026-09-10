import { NextResponse } from 'next/server';
import { getLogosByNames } from '../../../lib/getSponsor';

const bankNames = ['UniCredit','Addiko Bank','Banca Intesa','Erste Group','ING','KBC','Luminor','mBank','NLB','OTP Bank','Raiffeisen Bank International','Santander','Société Générale'];

export async function GET() {
  const logos = await getLogosByNames(bankNames);
  return NextResponse.json(logos);
}