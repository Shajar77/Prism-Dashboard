# Prism Energy Dashboard

A professional, high-fidelity **Solar & Wind Energy Project Management Dashboard** built with Next.js 15 (App Router), Zustand, Recharts, and Tailwind CSS. Designed for monitoring renewable energy assets, tracking project specifications, and visualizing portfolio performance in real time.

---

## Features

- **Portfolio Overview** — Live stat cards: capacity utilization, portfolio sites, energy output estimates, and portfolio valuation with animated Recharts graphs
- **Project Management** — Full CRUD (Create, Read, Update, Delete) for energy projects with a multi-section modal covering core info, timeline, technical specs, location, and contact details
- **Expandable Table** — Click any project row to reveal detailed site specifications, deployment forms, executive report links, and key contacts — all inline
- **URL-synced Filters** — Search and category filters are kept in the URL query string, making them shareable and back-button-friendly
- **Offline-first Architecture** — All API calls fall back gracefully to mock data when the backend is unavailable; projects are cached locally via Zustand `persist`
- **Optimistic UI** — Edits and deletes are applied instantly in the UI before the API responds
- **Auth System** — Cookie-based session managed by Next.js Middleware (server) + Zustand `AuthGuard` (client); supports signup, login, logout
- **Dark Mode First** — Premium dark aesthetic with glassmorphism, `#D3FF33` brand accent, and responsive layouts
- **Fully Responsive** — Custom floating sidebar on desktop, hamburger menu on mobile; table collapses to name+actions on small screens

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) — App Router, API Route Handlers |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) with `persist` middleware |
| Charts | [Recharts](https://recharts.org/) — dynamically imported (no SSR) |
| UI Components | [Shadcn/UI](https://ui.shadcn.com/) (Dialog, Select, Input, Label, Sonner) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via `next/font` |
| Analytics | [@vercel/analytics](https://vercel.com/analytics) (production only) |

---

## Project Structure

```text
├── app/
│   ├── api/projects/         # Next.js API route handlers (JWT proxy to backend)
│   ├── dashboard/            # Main dashboard page + sub-routes (projects, lifecycle, etc.)
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── error.tsx             # Global error boundary
│   ├── layout.tsx            # Root layout (font, theme, toaster)
│   └── globals.css           # Tailwind base + CSS variables (light & dark)
├── components/
│   ├── dashboard/
│   │   ├── ProjectDetailsPanel.tsx    # Inline expanded row — specs, forms, contacts
│   │   ├── ProjectManagementModals.tsx # Add/Edit/Delete modals
│   │   ├── RechartsStatCards.tsx      # Animated chart cards (dynamic import)
│   │   └── StaticStatCards.tsx        # Static stat cards (Performance Index, Top Capacity)
│   ├── ui/                   # Shadcn UI primitives
│   ├── AuthGuard.tsx         # Client-side auth protection wrapper
│   ├── CustomFormElements.tsx # TextField & SelectField form components
│   ├── CustomTable.tsx       # Sortable, paginated, expandable table
│   ├── Modal.tsx             # Dialog wrapper
│   ├── TopNav.tsx            # Top navigation (mobile menu, theme toggle, profile)
│   └── app-sidebar.tsx       # Floating pill sidebar (desktop)
├── hooks/
│   └── useDashboardStats.ts  # Derives all dashboard KPIs from the projects array
├── lib/
│   ├── nav.ts                # Single source of truth for navigation items
│   └── utils.ts              # cn() class merge utility
├── stores/
│   ├── authStore.ts          # Auth state: signup, login, logout, cookie management
│   ├── projectStore.ts       # Projects: fetch, add, update, delete, TTL cache
│   └── uiStore.ts            # Modal state + form data
├── utils/
│   └── api.ts                # API client: types, fetch helpers, fallback mock data
├── middleware.ts              # Cookie-based route protection (server-side)
├── .env.local.example        # Environment variable template
└── public/                   # Static assets (logo, background image)
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shajar77/Saas-Dashboard.git
   cd Saas-Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your backend JWT token:
   ```
   JWT_TOKEN=your_jwt_token_here
   ```
   > The app works without a token — all API calls fall back to mock data automatically.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login` — sign up for an account first.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `JWT_TOKEN` | Optional | Bearer token for the Prism backend API. Without it, the app uses offline mock data. |

> **Security**: `JWT_TOKEN` has no `NEXT_PUBLIC_` prefix — it is a server-only variable and is never exposed to the client bundle. All API calls are proxied through `/app/api/projects/*` route handlers.

---

## Scripts

```bash
npm run dev     # Development server (with HMR)
npm run build   # Production build
npm run start   # Production server
npm run lint    # ESLint
```

---

## License

MIT
