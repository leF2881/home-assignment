# Vite & HeroUI Template

This is a template for creating applications using Vite and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/heroui-inc/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/heroui-inc/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/vite-template/blob/main/LICENSE).


src/
├── app/
│   └── store.ts                    # Redux store configuration
│
├── features/
│   ├── auth/
│   │   ├── authSlice.ts           # Redux slice for authentication
│   │   ├── authAPI.ts             # API calls for login/refresh
│   │   ├── authTypes.ts           # Auth-related types
│   │   └── LoginPage.tsx          # Login component
│   │
│   ├── incidents/
│   │   ├── incidentsSlice.ts      # Redux slice for incidents
│   │   ├── incidentsAPI.ts        # REST API calls
│   │   ├── incidentsTypes.ts      # Incident-related types
│   │   ├── websocket.ts           # WebSocket connection logic
│   │   └── components/
│   │       ├── IncidentTable.tsx
│   │       ├── IncidentRow.tsx
│   │       ├── FilterControls.tsx
│   │       ├── SummaryCards.tsx
│   │       └── DashboardHeader.tsx
│   │
│   └── dashboard/
│       └── DashboardPage.tsx       # Main dashboard container
│
├── hooks/
│   ├── useWebSocket.ts            # Custom hook for WebSocket
│   ├── useFilters.ts              # Custom hook for URL sync
│   └── useTokenRefresh.ts         # Custom hook for token refresh
│
├── types/
│   ├── index.ts                   # Shared types export
│   ├── api.types.ts               # API response types
│   └── redux.types.ts             # Redux state types
│
├── utils/
│   ├── api.ts                     # Axios instance with interceptors
│   └── constants.ts               # Severity levels, categories, etc.
│
├── App.tsx                        # Main app with routing
├── main.tsx                       # Entry point
├── vite-env.d.ts                  # Vite types
└── index.css                      # Tailwind imports
________


Authentication System

Login עם JWT
Token refresh אוטומטי
Cookie handling
Logout capability


Real-Time Incident Display

טעינת incidents ראשונית (REST API)
עדכונים בזמן אמת (WebSocket)
Connection status indicator
Auto-reconnection על ניתוק


Incident Management

הצגת incidents בטבלה
Status updates (Resolve/Escalate)
Optimistic updates
Error handling על failures


Filtering & Sorting

Filter by severity (multi-select)
Filter by status
Filter by category
Sort by timestamp/severity
Search by source IP
URL sync (query params)


Summary Dashboard

Severity count cards
Real-time count updates
Visual hierarchy


Visual Alerts

CRITICAL incidents highlight
Alert notifications on new CRITICAL
______

┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  🔒 SOC Incident Dashboard    🟢 Connected    👤 analyst [↗️]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SUMMARY CARDS (Row)                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │🔴CRITICAL│  │🟠 HIGH   │  │🟡 MEDIUM │  │🟢 LOW    │       │
│  │    8     │  │    23    │  │    45    │  │    12    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FILTERS & SEARCH                                               │
│  ┌─────────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────┐ │
│  │  Severity ▼ │ │ Status ▼  │ │Category ▼ │ │🔍 Search IP  │ │
│  └─────────────┘ └───────────┘ └───────────┘ └──────────────┘ │
│  [Clear Filters]                    Sort: ⏰ Newest First ▼    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INCIDENTS TABLE                                                │
│  ┌──────┬─────────┬────────────┬───────────────┬────────┬─────┐│
│  │Sev   │Status   │Category    │Source         │Time    │Acts ││
│  ├──────┼─────────┼────────────┼───────────────┼────────┼─────┤│
│  │🔴CRIT│🔴OPEN   │Malware     │192.168.1.45   │2m ago  │[R][E││
│  │🟠HIGH│🟢RESOLV │Intrusion   │10.0.0.23      │15m ago │ --- ││
│  │🟡MED │🔵ESCAL │DDoS        │172.16.0.5     │1h ago  │ --- ││
│  │...   │...      │...         │...            │...     │...  ││
│  └──────┴─────────┴────────────┴───────────────┴────────┴─────┘│
│                                                                 │
│  Showing 156 incidents (3 filtered out)          [Load More]   │
└─────────────────────────────────────────────────────────────────┘
________
🚀 תכנית מימוש - High Level Tasksסדר המשימות (לפי עדיפות):✅ PHASE 1 - Foundation & Setup

Project Setup - Vite + Dependencies
Folder Structure - ארגון תיקיות
Redux Store Setup - Store בסיסי + Slices ריקים
HeroUI Configuration - Theme + Provider
✅ PHASE 2 - Authentication

Auth Slice - Redux logic לאימות
Auth API Service - קריאות HTTP
Login Page - UI + Integration
Protected Routes - Route guard
Token Refresh - Auto refresh logic
✅ PHASE 3 - Incidents Display

Incidents Slice - Entity adapter
Incidents API Service - REST endpoints
Dashboard Layout - Header + Structure
Incidents Table - Basic display
Summary Cards - Severity counts
✅ PHASE 4 - Real-Time Updates

WebSocket Service - Connection logic
Connection Slice - Status management
WebSocket Integration - Redux middleware
Real-Time Updates - Handle incoming incidents
Critical Alerts - Visual notifications
✅ PHASE 5 - Filtering & Actions

Filters Slice - Filter state
URL Sync Hook - Query params
Filter Components - UI controls
Incident Actions - Resolve/Escalate
Optimistic Updates - UX improvements
✅ PHASE 6 - Polish

Error Handling - Global + Per-feature
Loading States - Spinners
Dark Mode - Theme switching
Responsive Design - Mobile support
Testing & Bug Fixes