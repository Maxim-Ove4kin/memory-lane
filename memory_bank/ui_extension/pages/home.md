# Home Page

## Route
`/`

## Purpose
Acts as the primary search entrypoint for the application.

## Main UI Elements
- App title and hand-drawn decorative underline.
- Search mode toggle between dish-name search and ingredient search.
- Single input field whose label and placeholder depend on selected search mode.
- Search action button.
- Three promotional feature cards.

## Data Flow
- Stores the current search input in `localStorage` under `searchQuery`.
- Navigates to `/results` with `next/navigation` router.

## Notes
- The page is client-rendered.
- Search execution is currently a prototype without backend validation.
