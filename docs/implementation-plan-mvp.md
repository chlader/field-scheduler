# Field Scheduler MVP - Implementation Plan

## Context

Build a Field Scheduler MVP web application from scratch. The app enables municipalities to manage field inventory and allows public users to browse field availability via a synced week-view calendar. Two separate React apps (booker + admin) share a common API backend. No booking functionality in MVP — just field management and availability display.

**Key decisions**: React + Node/Express + PostgreSQL, MUI, monorepo, no auth for MVP, custom-duration availability slots, week view calendar.

---

## 1. Monorepo Structure

```
field-scheduler/
├── package.json                  # Root: npm workspaces config
├── tsconfig.base.json            # Shared TS config
├── .gitignore
├── packages/
│   ├── shared/                   # Shared types, API client, constants
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── types/
│   │       │   ├── field.ts      # Field, FieldType, Amenity types
│   │       │   ├── availability.ts # AvailabilitySlot, DayOfWeek types
│   │       │   └── index.ts
│   │       ├── api-client.ts     # Typed fetch wrapper for API calls
│   │       └── index.ts
│   ├── api/                      # Node.js + Express backend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts          # Express app entry, middleware, listen
│   │       ├── db.ts             # pg Pool setup
│   │       ├── migrate.ts        # Run SQL migrations on startup
│   │       ├── migrations/
│   │       │   └── 001_initial.sql
│   │       └── routes/
│   │           ├── fields.ts     # /api/fields CRUD
│   │           └── availability.ts # /api/fields/:id/availability CRUD + weekly resolution
│   ├── booker-app/               # Public-facing React SPA
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx           # Router setup
│   │       ├── theme.ts          # MUI theme
│   │       ├── pages/
│   │       │   ├── FieldListPage.tsx    # Browse all fields
│   │       │   ├── FieldDetailPage.tsx  # Single field details + its weekly calendar
│   │       │   └── CalendarPage.tsx     # Full week view across all fields
│   │       └── components/
│   │           ├── FieldCard.tsx        # Field summary card
│   │           ├── WeekCalendar.tsx     # Week grid: time rows × field columns
│   │           ├── WeekNavigator.tsx    # Prev/next week controls + date display
│   │           └── AvailabilityBlock.tsx # Colored block representing an available window
│   └── admin-app/                # Admin management React SPA
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── theme.ts
│           ├── pages/
│           │   ├── DashboardPage.tsx       # Overview: field count, quick links
│           │   ├── FieldListPage.tsx        # Table of all fields with edit/delete
│           │   ├── FieldFormPage.tsx        # Add/edit field form
│           │   └── AvailabilityPage.tsx     # Manage availability slots for a field
│           └── components/
│               ├── FieldTable.tsx           # MUI DataGrid/Table of fields
│               ├── FieldForm.tsx            # Form: name, type, location, amenities
│               ├── AvailabilitySlotForm.tsx # Form: day of week, start time, end time
│               └── AvailabilitySlotList.tsx # List of existing slots with delete
```

---

## 2. Database Schema (PostgreSQL)

```sql
-- 001_initial.sql

CREATE TABLE IF NOT EXISTS fields (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  field_type    VARCHAR(100) NOT NULL,       -- e.g., 'soccer', 'baseball', 'multi-purpose'
  surface       VARCHAR(100),                -- e.g., 'grass', 'turf', 'dirt'
  location      VARCHAR(500),                -- address or description
  amenities     TEXT[] DEFAULT '{}',         -- array of strings: 'lights', 'restrooms', 'parking', etc.
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability_slots (
  id            SERIAL PRIMARY KEY,
  field_id      INTEGER NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  day_of_week   SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sunday, 6=Saturday
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_availability_field ON availability_slots(field_id);
CREATE INDEX idx_availability_day ON availability_slots(day_of_week);
```

**Key design**: Availability uses a **recurring weekly template model**. Admins define patterns like "Monday 9:00-12:00" rather than per-date entries. The API resolves these templates into concrete date/time windows for any requested week. This is compact, intuitive for admins, and extensible for future date-specific overrides.

---

## 3. API Endpoints

### Fields
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/fields` | List all active fields |
| GET    | `/api/fields/:id` | Get single field by ID |
| POST   | `/api/fields` | Create a new field |
| PUT    | `/api/fields/:id` | Update a field |
| DELETE | `/api/fields/:id` | Soft-delete (set is_active=false) |

### Availability
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/fields/:id/availability` | Get recurring availability slots for a field |
| POST   | `/api/fields/:id/availability` | Add an availability slot |
| DELETE | `/api/availability/:slotId` | Remove an availability slot |
| GET    | `/api/availability/week?date=YYYY-MM-DD` | Get resolved availability for all fields for the week containing `date` |

The `/api/availability/week` endpoint is the key one for the booker calendar. It takes a date, determines the week (Sun-Sat), and maps each field's recurring templates onto concrete dates, returning:
```json
{
  "weekStart": "2025-02-09",
  "weekEnd": "2025-02-15",
  "fields": [
    {
      "fieldId": 1,
      "fieldName": "Field A",
      "slots": [
        { "date": "2025-02-10", "startTime": "09:00", "endTime": "12:00" },
        { "date": "2025-02-10", "startTime": "14:00", "endTime": "18:00" }
      ]
    }
  ]
}
```

---

## 4. Implementation Sequence

### Step 1: Project scaffolding
- Initialize root `package.json` with npm workspaces
- Create `tsconfig.base.json`
- Scaffold all 4 packages with `package.json` and `tsconfig.json`
- Add `.gitignore`

### Step 2: Shared package
- Define TypeScript types for Field, AvailabilitySlot, API responses
- Build API client (typed fetch wrapper with base URL config)

### Step 3: API server
- Set up Express app with CORS, JSON parsing
- Set up PostgreSQL connection via `pg` Pool
- Create migration runner + `001_initial.sql`
- Implement fields CRUD routes
- Implement availability CRUD routes + week resolution endpoint

### Step 4: Admin app
- Scaffold Vite + React + MUI
- Dashboard page with field count
- Field list page with MUI Table (view/edit/delete)
- Field form page (create + edit modes)
- Availability management page (add/remove slots for a field)

### Step 5: Booker app
- Scaffold Vite + React + MUI
- Field list page with cards
- Field detail page
- Calendar page with week view grid (time rows x field columns, availability blocks)
- Week navigator (prev/next week)

### Step 6: Polish & wire up
- API proxy config in Vite for dev
- Concurrent dev script in root package.json
- End-to-end smoke test

---

## 5. Key Technical Details

### Week Calendar Component (Booker)
- Grid layout: Y-axis = hours (6 AM-10 PM), X-axis = days of week
- Each field shown as a column within each day, or a separate row per field
- Available windows shown as colored blocks
- Navigate between weeks with prev/next buttons
- Fetches from `/api/availability/week?date=...`

### Dev Setup
- Root `npm install` installs all workspace deps
- `npm run dev` from root runs API + both apps concurrently
- API on port 3001, booker-app on port 5173, admin-app on port 5174
- Vite proxy forwards `/api` requests to API server

### Dependencies
- **API**: express, cors, pg, dotenv, tsx (dev runner)
- **Booker/Admin apps**: react, react-dom, react-router-dom, @mui/material, @emotion/react, @emotion/styled, @mui/icons-material, dayjs
- **Shared**: typescript only (no runtime deps)
- **Root**: concurrently (to run all services)

---

## 6. Verification

1. Start PostgreSQL locally, create `field_scheduler` database
2. `npm install` from root
3. `npm run dev` — starts API (3001), booker (5173), admin (5174)
4. **Admin app**: Create a field with name, type, location, amenities -> appears in field list
5. **Admin app**: Add availability slots (e.g., Monday 9-12, Wednesday 14-18) -> appear in slot list
6. **Booker app**: Field list shows created fields -> click into field detail
7. **Booker app**: Calendar page shows week view with availability blocks matching admin-defined slots
8. Navigate between weeks — availability repeats (recurring template model)
9. Edit/delete a field in admin -> changes reflected immediately in booker app on refresh
