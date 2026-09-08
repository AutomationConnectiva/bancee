# Banking CEE Website — Final QA

Date: 8 September 2026

## Verified against locked project decisions
- Public navigation: Network, Expo, Summit, Insights, Partners, Contact.
- Mobile navigation present; Full Agenda and Complete Registration are not exposed in global navigation/footer.
- Home conversion paths: Attend -> Request Attendance; Contribute -> Speaker Interest; Partner -> Partnership Enquiry.
- Expo/Summit public agenda CTAs stay on public preview sections; no public direct link to the Full Agenda.
- Full Expo Agenda remains unlisted/noindex and excluded from public navigation.
- Complete Registration remains private/noindex.
- Summit attendance language uses `100 Attendees`, not `100+ Attendees`.
- Partners page separates bank-community proof from 48 approved technology partners; additional bank logos can be added manually by IT later.
- Association/Media promotional section is removed from Partners.
- Insights remains Coming Soon with three interview slots coded but hidden.
- Newsletter capture is functional and carries source/UTM/consent context.
- Speaker Interest has required event selection, expertise and contribution choices.
- Request Attendance preserves `source` query parameters through submission.
- Registration headshot selection now uploads the actual file to Supabase Storage when server credentials/bucket are configured.
- Legacy review fallback includes Approve / Sponsorship Opportunity / Decline.
- Agenda speaker enrichment prefers `speaker_id` where the agenda data provides it, with name fallback for current legacy rows.
- Contact Speaking Opportunities routes to Speaker Interest.
- Internal href/anchor audit found no public Full Agenda or Complete Registration links and all live public hash targets resolve. The single `href="#"` in AdvisoryGrid is an intentional JS-controlled expand/collapse control.

## Deployment validation
A full Next.js production build was not run in this environment because the project dependencies are not installed. The globally available TypeScript compiler cannot resolve Next/React/Node types without those dependencies. IT should run:

    npm install
    npm run build

before deployment, then complete live browser QA on desktop and mobile.

## Required/optional environment configuration
See `.env.example`. In particular:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, for headshot uploads)
- `REGISTRATION_PHOTO_BUCKET`
- `NEWSLETTER_TABLE`
- Make webhook URLs as used by the Connectiva OS workflows

Operational workflow remains: Website/Supabase capture -> Make orchestration -> Airtable operational workflow -> Zoho Mail communications.
