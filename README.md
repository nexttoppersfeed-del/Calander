# Calander — Full Feature Architecture

This package contains the reference UI plus the complete modular folder architecture requested for the next feature phase.

## Major modules

- Calendar: day, 3-day, week, month, year, agenda, timeline, week numbers
- Events: recurrence, reminders, attendees, locations, attachments, categories, conflicts, free/busy, status
- Productivity: tasks, priorities, Focus Time, Pomodoro, countdown, daily planning, streaks
- India: festivals, holidays, regional data, lunar calendar foundation, school calendar
- Smart: search, quick-add parser, natural dates, conflict detection, suggestions, time zones, travel-time foundation
- Notifications: permission, reminder engine, sounds, quiet-hours foundation
- UI: sheets, dialogs, bottom nav, FAB, context menus, snackbar, loading, empty states, tooltips
- Animations: liquid glass, page transitions, shared elements, spring physics, gestures, haptics-ready
- Themes: dark, light, AMOLED, gradients, custom theme storage
- Data: JSON backup/restore, ICS import/export foundation, CSV, migration
- World: world clock, time zones, alternate calendars, international holiday configuration
- Weather: weather/event-weather/forecast integration points
- Widgets: today, countdown, agenda, month widget foundations
- Settings: calendar, event, notification, appearance, privacy and backup settings

The modules are intentionally separated so future implementations can be expanded without turning app.js into a monolith.
