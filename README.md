# Train Map

This app visualizes German train stations on a Leaflet map, with a city filter that keeps the list and map markers in sync. It uses React + TypeScript, Tailwind CSS, and a small context layer to keep state cohesive.

## Setup

Run these from `my-app/`:

- `npm install`
- `npm run dev` for the local dev server
- `npm test` for unit and integration tests
- `npm run lint` for ESLint
- `npm run build` for a production build
- `npm run preview` to serve the production build locally

## Project Structure

- `src/components/` UI components such as `CityFilter`, `StationList`, and `MapView`
- `src/context/` data and UI state in `StationsProvider`
- `src/api/` data fetching in `stations.ts`
- `src/types/` shared TypeScript types
- `src/tests/` unit and integration tests
- `docs/components.md` component responsibilities and relationships

## Data Source

Stations are fetched from the GitHub Gist endpoint defined in `src/api/stations.ts`. The response is validated before being stored in state.

## Decisions and Tradeoffs

- Context-based state keeps dependencies light and is enough for this scope. A dedicated state library is not used.
- City filtering is exact-match based on the dataset. It keeps the UI predictable, but does not support fuzzy search.
- The map centers on Germany by default. When a city is filtered or a station is selected, the view recenters to keep the UX focused.
- Tests use Vitest and Testing Library. Coverage targets key interactions, not full end-to-end flows.
- Styling relies on Tailwind v4 with a small custom CSS block for the selected marker animation.
