import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendConfirmation } from '../../../../lib/registration';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const b = await req.json();

    // ---------------------------------------------------------
    // 1. Validate required fields
    // ---------------------------------------------------------

    const requiredFields = [
      'firstName',
      'lastName',
      'jobTitle',
      'organisation',
      'email',
      'country',
    ];

    for (const field of requiredFields) {
      if (!b[field]) {
        return NextResponse.json(
          { error: `Missing ${field}` },
          { status: 400 }
        );
      }
    }

    if (!b.tokenOrCode) {
      return NextResponse.json(
        { error: 'Registration token is missing.' },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 2. Find approved pre-registration
    // ---------------------------------------------------------

    const {
      data: submission,
      error: submissionError,
    } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('registration_token', b.tokenOrCode)
      .eq('approval_status', 'Approved')
      .single();

    if (submissionError || !submission) {
      console.error(
        'Pre-registration lookup error:',
        submissionError
      );

      return NextResponse.json(
        {
          error:
            'This registration invitation is invalid, has not been approved, or has been revoked.',
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 3. Prevent duplicate completed registration
    // ---------------------------------------------------------

    const {
      data: existingRegistration,
      error: existingError,
    } = await supabase
      .from('registration')
      .select('id')
      .eq('form_submission_id', submission.id)
      .maybeSingle();

    if (existingError) {
      console.error(
        'Duplicate registration check error:',
        existingError
      );

      return NextResponse.json(
        {
          error: 'Could not verify the registration.',
        },
        { status: 500 }
      );
    }

    if (existingRegistration) {
      return NextResponse.json(
        {
          error: 'This registration has already been completed.',
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------------------
    // 4. Prepare data for registration table
    // ---------------------------------------------------------

    const registeredAt = new Date().toISOString();

    const registrationData = {
      form_submission_id: submission.id,

      mode: 'token',
      token_or_code: b.tokenOrCode,
      invite_code: null,

      participant_type: 'Delegate',

      event: b.event,

      first_name: b.firstName,
      last_name: b.lastName,
      job_title: b.jobTitle,
      organisation: b.organisation,
      email: b.email,
      country: b.country,
      mobile: b.mobile || null,
      website: b.website || null,

      interests: b.interests || [],
      goals: b.goals || [],

      company1: b.company1 || null,
      company2: b.company2 || null,
      company3: b.company3 || null,

      profile_method: b.profileMethod || 'manual',
      profile_photo_file_name:
        b.profilePhotoFileName || null,

      photo_url: b.photoUrl || null,
      bio: b.bio || null,

      profile_visible: !!b.profileVisible,

      linkedin: b.linkedin || null,

      attendance_days: b.attendanceDays || null,
      gala: b.gala || null,
      heard_about: b.heardAbout || null,

      marketing: !!b.marketing,
      privacy: !!b.privacy,

      status: 'registered',

      registered_at: registeredAt,

      source: b.source || 'approved-delegate',

      utm_source: b.utmSource || null,
      utm_medium: b.utmMedium || null,
      utm_campaign: b.utmCampaign || null,
      referrer: b.referrer || null,
    };

    // ---------------------------------------------------------
    // 5. SAVE INTO registration TABLE
    // ---------------------------------------------------------

    const {
      data: registration,
      error: registrationError,
    } = await supabase
      .from('registration')
      .insert(registrationData)
      .select('id')
      .single();

    if (registrationError) {
      console.error(
        'Registration insert error:',
        registrationError
      );

      return NextResponse.json(
        {
          error: `Registration could not be saved: ${registrationError.message}`,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 6. Optional Make.com webhook
    // ---------------------------------------------------------

    if (process.env.MAKE_REGISTRATION_WEBHOOK_URL) {
      try {
        const hook = await fetch(
          process.env.MAKE_REGISTRATION_WEBHOOK_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              form_type: 'completed_registration',
              participantType: 'Delegate',

              registration_id: registration.id,
              form_submission_id: submission.id,

              submitted_at: registeredAt,

              ...b,
            }),
          }
        );

        if (!hook.ok) {
          console.error(
            `Make registration webhook returned ${hook.status}`
          );
        }
      } catch (webhookError) {
        console.error(
          'Make registration webhook error:',
          webhookError
        );
      }
    }

    // ---------------------------------------------------------
    // 7. Send confirmation
    // ---------------------------------------------------------

    try {
      await sendConfirmation({
        id: registration.id,

        token: b.tokenOrCode,

        participantType: 'delegate',

        event: b.event,

        firstName: b.firstName,
        lastName: b.lastName,

        jobTitle: b.jobTitle,
        organisation: b.organisation,

        email: b.email,
        mobile: b.mobile,
        country: b.country,
        website: b.website,

        linkedin: b.linkedin,

        interests: b.interests || [],
        goals: b.goals || [],

        companiesToMeet: [
          b.company1,
          b.company2,
          b.company3,
        ].filter(Boolean),

        profileMethod: b.profileMethod,

        profilePhotoFileName:
          b.profilePhotoFileName,

        photoUrl: b.photoUrl,

        bio: b.bio,

        profileVisible: !!b.profileVisible,

        attendanceDays: b.attendanceDays,

        gala: b.gala,

        heardAbout: b.heardAbout,

        marketing: !!b.marketing,
        privacy: !!b.privacy,

        status: 'registered',

        registeredAt,
      } as any);
    } catch (confirmationError) {
      console.error(
        'Confirmation email error:',
        confirmationError
      );
    }

    // ---------------------------------------------------------
    // 8. Success
    // ---------------------------------------------------------

    return NextResponse.json({
      ok: true,
      id: registration.id,
    });

  } catch (error) {
    console.error(
      'Registration API error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Registration could not be completed. Please try again.',
      },
      { status: 500 }
    );
  }
}