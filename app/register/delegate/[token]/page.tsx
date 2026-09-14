import Header from '../../../../components/Header';
import RegistrationForm from '../../../../components/RegistrationForm';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function eventLabel(event: string) {
  if (event === 'expo-2026') return 'Banking CEE Expo 2026';
  if (event === 'summit-2027') return 'Digital Banking CEE Summit 2027';
  return event;
}

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: submission, error } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('registration_token', token)
    .eq('approval_status', 'Approved')
    .single();

  if (error || !submission) {
    return (
      <main className="private-register">
        <section className="contact-hero">
          <Header />
          <div className="shell contact-content">
            <p className="eyebrow">Private Registration</p>
            <h1>Registration Link Invalid.</h1>
            <p>
              This personal registration invitation is invalid, expired or has
              been revoked.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const event = submission.event_name || '';

  const initial = {
    firstName: submission.first_name || '',
    lastName: submission.last_name || '',
    jobTitle: submission.job_title || '',
    organisation: submission.company || '',
    email: submission.email || '',
    country: submission.country || '',
    mobile: submission.phone || '',
    website: submission.website || '',
    linkedin: '',
  };

  return (
    <main>
      <section
        className={`registration-hero ${
          event === 'summit-2027' ? 'registration-summit' : ''
        }`}
      >
        <Header />

        <div className="shell registration-hero-copy">
          <p className="eyebrow">Private Registration</p>

          <h1>Welcome, {submission.first_name}.</h1>

          <p>
            Your attendance has been approved for{' '}
            <strong>{eventLabel(event)}</strong>. Please complete your
            registration below.
          </p>
        </div>
      </section>

      <section className="section-white">
        <div className="shell registration-shell">
          <RegistrationForm
            mode="token"
            tokenOrCode={token}
            event={event}
            initial={initial}
            source="approved-delegate"
          />
        </div>
      </section>
    </main>
  );
}