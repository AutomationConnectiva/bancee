# Final Design Revision

This build starts from `Banking_CEE_GitHub_Master_UX_FINAL` / revision10 and applies the final locked design corrections.

## Headline system
- One shared section-headline scale across equivalent sections.
- Network in Numbers: `Built Across CEE.` / `Built Over Time.`
- Advisory Board: `Industry Experience` / `at the Heart of` / `Banking CEE.`
- Journey: `From Online Beginnings` / `to a Banking Community` / `Across CEE.`
- Join Banking CEE: `Be Part of What` / `Comes Next.`
- Expo Join: `Built for the Right` / `People to Be in` / `the Room.`
- Summit Speakers: `Senior Practitioners.` / `Practical Perspectives.`
- Summit Agenda: `Seven Themes.` / `One Focused` / `Conversation.`
- Summit Experience: `More Space for the` / `Conversations` / `That Matter.`
- Desktop line breaks are intentional; responsive typography remains fluid.

## Network in Numbers
- Removed vertical separators between individual statistics.
- Retained the single horizontal structural line.
- Existing count-up and interactive statistic treatment remains.

## Full Expo Agenda
- `/expo/agenda` restored as a dedicated premium agenda experience.
- Dedicated hero, day/stage pills, module cards, sponsor logos, speaker cards, discussion-point expansion, conversion strip and final three-path CTA.
- Remains unlisted/noindex and outside the public navigation/footer.
- Continues to use the unified agenda/Supabase speaker data layer.

## Public outreach registration URL
- Added `/register` as a permanent shareable attendance-request URL.
- Supports `?event=expo-2026` and `?event=summit-2027`.
- Supports `&source=...` campaign/source tracking.
- `/register/delegate/[token]` remains the private approved-attendee completion route.
- The public `/register` route is intentionally noindex because it is an outreach/utility entry point rather than a navigation destination.
