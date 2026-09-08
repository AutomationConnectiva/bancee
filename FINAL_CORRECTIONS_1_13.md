# Banking CEE — Final Corrections 1–13

Applied on top of `Banking_CEE_GitHub_Master_DESIGN_FINAL.zip`.

1. Advisory Board desktop headline locked to: `Industry Experience` / `at the Heart of` / `Banking CEE.`
2. Our Journey desktop headline locked to: `From Online Beginnings` / `to a Banking Community` / `Across CEE.`
3. 70/30 audience component preserves the true split, prevents clipping, and uses internal hover emphasis rather than resizing the segments.
4. Expo Agenda preview headline locked to: `Built Around the` / `Priorities Shaping` / `Banking Across CEE.`
5. Expo Experience headline locked to: `Content Is Only One` / `Part of the Expo.`
6. Summit Speakers headline locked to: `Senior Practitioners.` / `Practical Perspectives.`
7. Embedded Expo and Summit Request Attendance forms receive the premium readable light-card treatment with dark labels, consistent inputs, focus states, spacing and CTA styling.
8. 70% audience label uses: `Banks, Financial Institutions, Regulators & Banking Associations` and stays on one line on wide desktop layouts.
9. Partners bank-community headline locked to: `Banking Institutions` / `Across the Banking` / `CEE Community.`
10. Full Agenda discovery headline locked to: `Continue Exploring` / `the Event.`
11. Full Agenda closing headline locked to: `Choose the Next Step` / `That Fits You.`
12. Full Agenda day/stage selectors restored to differentiated states: blue for Day, green for Stage.
13. `/register` is now the reusable full registration form for direct email/LinkedIn outreach, with optional event/source query parameters. `/request-attendance` remains the public qualification flow, while `/register/delegate/[token]` remains the prefilled approved-attendee route.

## Registration URLs
- `/register`
- `/register?event=expo-2026`
- `/register?event=summit-2027`
- Optional tracking: `&source=linkedin-outreach`, `&utm_source=...`, etc.
- Approved attendee route: `/register/delegate/[token]`

## Validation
All 68 non-declaration TypeScript/TSX source files were syntax-transpiled with TypeScript 5.8.3 with zero syntax-error files. A full Next.js production build still requires the project dependencies/environment during deployment.
