# Results Page

## Route
`/results`

## Purpose
Displays the result of the current recipe search request.

## Main UI Elements
- Search query heading.
- Button for starting a new search.
- Loading indicator.
- Grid of mocked recipe cards.
- Empty-state message when no recipes are available.

## Data Flow
- Reads `searchQuery` from `localStorage`.
- Simulates async loading with `setTimeout`.
- Renders static sample recipe objects from component state.

## Notes
- No recipe detail navigation is implemented yet.
- The page is a frontend placeholder for a future real search backend.
