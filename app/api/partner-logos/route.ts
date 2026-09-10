import { NextResponse } from 'next/server';
import { getAllLogos } from '../../../lib/getSponsor';

export async function GET() {
  const logos = await getAllLogos();
  return NextResponse.json(logos);
}