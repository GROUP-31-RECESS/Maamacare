# MamaCare Merge Notes

This version keeps MamaCare as a mother-only smart maternal monitoring system. The uploaded similar project was reviewed for useful ideas, but immunisation/child/admin/health-worker workflows were not added.

## Features adopted from the similar project

1. **Reminder timing logic**
   - Appointment reminders now show status such as `Today`, `Tomorrow`, `In 7 days`, or `Overdue`.
   - MamaCare still does not book appointments. The mother enters an appointment date she already received, and the system reminds her.

2. **Reminder preference setting**
   - Added a settings option for preferred reminder method: `In-app`, `SMS later`, or `WhatsApp later`.
   - SMS and WhatsApp are prepared as future integration choices; no external messaging API was added.

3. **Backend notification generation**
   - The notification endpoint now generates useful appointment, medication, and health-alert reminders instead of returning a placeholder response.

4. **Hospital result logging improvement**
   - Vitals logging now supports weight in kg and facility/source of results.
   - This supports the mother entering results she received from a hospital or clinic, such as weight and blood pressure.

5. **Scope cleanup**
   - Appointment wording was corrected from booking/clinic workflow language to mother-entered reminder language.
   - Digital card wording was adjusted to avoid immunisation tracking language.

## Explicitly not added

- Immunisation feature
- Child registration / child timelines
- Health-worker dashboard
- Admin dashboard
- Facility management
- Referral workflows
- Appointment booking workflows

## Validation done

- Frontend production build passed with `npm run build`.
- Backend JavaScript syntax passed with `node --check`.
- Prisma schema validation could not be completed in the sandbox because Prisma attempted to download engine binaries from `binaries.prisma.sh`, which was unavailable. The Prisma schema and migration files were updated manually.
