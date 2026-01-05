# Components and Architecture

This document describes the main UI components and how data flows between them.

## App

- Concern: Top-level composition and layout.
- Relations: Wraps `StationsProvider`, renders `CityFilter`, `StationList`, and `MapView`.

## CityFilter

- Concern: Choose and clear the active city filter.
- Relations: Uses `useStations()` to read `cities` and `cityFilter`, and calls `setCityFilter` or `clearFilter`.

## StationList

- Concern: Display the filtered station list and allow selection.
- Relations: Uses `useStations()` to read `filteredStations` and `selectedStationId`, and calls `setSelectedStation` when a list item is clicked.

## MapView

- Concern: Render the Leaflet map shell, tile layer, and markers.
- Relations: Uses `useStations()` to read `filteredStations` and selection state, and composes `MapController` and `StationMarker` to handle map movement and selection.

## MapController

- Concern: Imperative map behavior (fly to selection, fit bounds on filter changes, and default centering).
- Relations: Receives stations and selection from `MapView`, uses Leaflet map methods to update the view with a small debounce.

## StationMarker

- Concern: Leaflet marker rendering and selection styling.
- Relations: Receives a `Station` plus selection state from `MapView`; opens the popup on selection and notifies selection on click.

## LoadingState

- Concern: Simple loading indicator used by list and map.
- Relations: Presentational only.

## StationsProvider (context)

- Concern: Fetch station data, manage loading and error state, and derive filtered results.
- Relations: Calls `fetchStations()` on mount, exposes `stations`, `filteredStations`, `cities`, `cityFilter`, and selection state to all components.

## useStations (hook)

- Concern: Convenience hook for accessing the stations' context.
- Relations: Used by `CityFilter`, `StationList`, and `MapView`.

## Data and Types

- `src/api/stations.ts` fetches station data from the GitHub Gist API and validates the response shape.
- `src/types/station.ts` defines the `Station` type used across context and components.
- `src/App.css` contains the selected marker animation used by `MapView`.
