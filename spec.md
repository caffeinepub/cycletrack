# Specification

## Summary
**Goal:** Add sex life tracking and safe/unsafe sex period guidance to the CycleTrack app.

**Planned changes:**
- Add a backend data model and CRUD API for sexual activity entries (date, protection used, optional notes), scoped to the authenticated user and persisted across upgrades.
- Add a backend function that returns a safe-sex status (`safe`, `unsafe`, or `caution`) for a given date based on the user's cycle and fertility phase data.
- Add a new "Intimacy" page accessible from the main navigation, displaying today's color-coded safe/unsafe sex status (green/yellow/red) with an explanatory message, and a sexual activity log with add, view, edit, and delete functionality.
- Add React Query hooks for fetching entries, creating, updating, and deleting entries, and fetching today's safe-sex status.
- Apply the existing rose/blush/cream warm feminine theme to all new UI.

**User-visible outcome:** Users can navigate to a new "Intimacy" page to see whether today is a safe, caution, or unsafe day for unprotected sex based on their cycle, and can log, view, edit, and delete past sexual activity entries.
