# Banking CEE Website — Phase 5

Current build includes:

- Banking CEE Network homepage (`/`)
- Banking CEE Expo (`/expo`)
- Digital Banking CEE Summit (`/summit`)
- Partners, Insights and Contact
- Dedicated Request Attendance page (`/request-attendance`)
- Working Request Attendance forms on Expo and Summit
- Server-side attendance request storage for development
- Automatic applicant acknowledgement email
- Internal attendance review email routed to the configured approver
- Secure expiring Approve / Decline links
- Approval generates a personal registration token automatically
- Approval sends the private registration invitation automatically
- Secure personal registration route validation (`/register/delegate/[token]`)

## Email configuration

For production, configure:

```env
NEXT_PUBLIC_SITE_URL=https://www.bancee.eu
APPROVER_EMAIL=mohamad@connectiva.events
APPROVAL_SECRET=replace-with-a-long-random-production-secret
RESEND_API_KEY=your-provider-api-key
EMAIL_FROM=Banking CEE Network <info@bancee.eu>
```

If `RESEND_API_KEY` is not configured, emails are written to `data/email-outbox.json` so the complete workflow can be tested locally without an email provider.

Attendance requests are currently stored in `data/attendance-requests.json` for the prototype. This is deliberately a Phase 5 development implementation; the production phase should migrate this storage to PostgreSQL before launch.

## Next phase

- Full private delegate registration form
- Speaker registration variant
- Registration completion/confirmation
- Campaign invitation links and capacity controls
- Organisation allocations
- PostgreSQL persistence

## Phase 7 — speaker invitations, organisation allocations & admin

Private administration is available at `/admin`.

Set `ADMIN_SECRET` in the environment. The development fallback is intentionally insecure and must be replaced before deployment.

The admin can now create:
- campaign invitation links with capacity and optional approval mode
- organisation allocations for sponsor representatives, delegates, associations or media
- personal or open-nomination speaker invitations

Registration routes:
- `/register/delegate/[token]` — approved personal delegate
- `/register/campaign/[code]` — campaign registration
- `/register/organisation/[code]` — organisation allocation
- `/register/speaker/[code]` — personal speaker or open nomination

All of these feed the same registration data structure. JSON storage remains a prototype persistence layer and should be migrated to PostgreSQL before production.

## Final verification notes (2026-09-08)
- Attendance `source` and UTM context are preserved through the public request flow.
- Insights newsletter now submits through `/api/newsletter` with consent timestamp and source context.
- Registration headshots upload through `/api/registration/photo` to Supabase Storage when configured.
- Legacy attendance review supports Approve, Sponsorship Opportunity and Decline; production workflow remains Make/Airtable/Zoho Mail.
- Agenda speaker enrichment prefers `speaker_id` when supplied by agenda rows, with normalized-name fallback for the current approved snapshot.
- Contact Speaking Opportunities routes to the dedicated Speaker Interest journey.
