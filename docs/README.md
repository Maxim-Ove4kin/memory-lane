# Architecture Overview

## Project Summary
Recipe Finder is a Next.js 15 web application with a hand-drawn visual style. The current implementation provides a homepage with two search modes and a results page with mocked recipe data.

## Main Directories
| Path | Purpose |
| --- | --- |
| `src/app` | App Router pages, layout, and global styles |
| `src/components/ui` | Reusable UI primitives based on shadcn-style components |
| `src/lib` | Shared helpers |
| `public` | Static assets |
| `docs` | Architecture and planning documentation |
| `memory_bank` | Persistent project memory for the coding agent |

## Runtime Architecture
| Area | Current State |
| --- | --- |
| Routing | `src/app/page.tsx` for homepage and `src/app/results/page.tsx` for search results |
| State | Local React state on the client; search query is passed through `localStorage` |
| Data | Results page uses mocked in-memory recipe data loaded with a delayed client-side effect |
| Styling | Tailwind CSS v4 plus custom global CSS utilities for the sketch style |
| UI Components | `Button`, `Input`, and `Card` primitives in `src/components/ui` |

## Current Feature Scope
1. Homepage with toggle between dish-name search and ingredient search.
2. Client-side navigation from homepage to results page.
3. Results page with loading state and mocked recipe cards.
4. Custom hand-drawn visual language implemented in `src/app/globals.css`.

## Planned Integrations
Product requirements and development notes reference Supabase for backend and authentication, but those integrations are not present in the codebase yet.

## Related Documents
1. `PRD.md`
2. `docs/development_plan.md`
