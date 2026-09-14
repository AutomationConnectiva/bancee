import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get('file');

    const event = String(
      form.get('event') || 'banking-cee'
    )
      .replace(/[^a-z0-9-]/gi, '-')
      .toLowerCase();

    // ---------------------------------------------------------
    // 1. Validate file
    // ---------------------------------------------------------

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'No image was selected.',
        },
        { status: 400 }
      );
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        {
          error: 'Please upload a JPG, PNG or WebP image.',
        },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: 'Please upload an image smaller than 5 MB.',
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 2. Check Supabase configuration
    // ---------------------------------------------------------

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            'Profile photo upload is not configured correctly.',
        },
        { status: 503 }
      );
    }

    // ---------------------------------------------------------
    // 3. Create Supabase server client
    // ---------------------------------------------------------

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // ---------------------------------------------------------
    // 4. Determine image extension
    // ---------------------------------------------------------

    let extension = 'jpg';

    if (file.type === 'image/png') {
      extension = 'png';
    }

    if (file.type === 'image/webp') {
      extension = 'webp';
    }

    // ---------------------------------------------------------
    // 5. Create unique storage path
    // ---------------------------------------------------------

    const fileName =
      `${Date.now()}-` +
      `${randomBytes(8).toString('hex')}.` +
      extension;

    const storagePath = `${event}/${fileName}`;

    // ---------------------------------------------------------
    // 6. Convert file to Buffer
    // ---------------------------------------------------------

    const bytes = Buffer.from(
      await file.arrayBuffer()
    );

    // ---------------------------------------------------------
    // 7. Upload into Supabase Storage
    // ---------------------------------------------------------

    const bucket = 'registration-photos';

    const {
      data: uploadData,
      error: uploadError,
    } = await supabase.storage
      .from(bucket)
      .upload(
        storagePath,
        bytes,
        {
          contentType: file.type,
          upsert: false,
        }
      );

    if (uploadError) {
      console.error(
        'PHOTO UPLOAD ERROR:',
        uploadError
      );

      return NextResponse.json(
        {
          error: `Photo upload failed: ${uploadError.message}`,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 8. Get public URL
    // ---------------------------------------------------------

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    const photoUrl =
      publicUrlData.publicUrl;

    // ---------------------------------------------------------
    // 9. Return photo information
    // ---------------------------------------------------------

    return NextResponse.json({
      ok: true,

      path: uploadData.path,

      fileName,

      photoUrl,
    });

  } catch (error: any) {
    console.error(
      'PHOTO UPLOAD ROUTE ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          'The photo could not be uploaded. Please try again.',
      },
      { status: 500 }
    );
  }
}