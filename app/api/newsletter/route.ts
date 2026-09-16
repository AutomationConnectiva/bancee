import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || '')
      .trim()
      .toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (body.consent !== 'accepted') {
      return NextResponse.json(
        {
          error:
            'Please confirm that you would like to receive Banking CEE communications.',
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('subscriptions')
      .upsert(
        { email },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Newsletter subscription error:', error);

      return NextResponse.json(
        { error: 'We could not subscribe you right now. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'You are now subscribed to Banking CEE updates.',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'We could not subscribe you right now. Please try again.' },
      { status: 500 }
    );
  }
}