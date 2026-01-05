import { useMemo } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import LoadingState from './LoadingState'
import { useStations } from '../hooks/useStations'
import MapController from './map/MapController'
import StationMarker from './map/StationMarker'

const GERMANY_CENTER: [number, number] = [51.1657, 10.4515]
const DEFAULT_ZOOM = 6

const MapView = () => {
    const {
        filteredStations,
        loading,
        error,
        stations,
        selectedStationId,
        selectedStation,
        setSelectedStation,
    } = useStations()

    const mapCenter: [number, number] = useMemo(() => {
        if (selectedStation) {
            return [selectedStation.lat, selectedStation.lng]
        }

        if (filteredStations.length > 0) {
            return [filteredStations[0].lat, filteredStations[0].lng]
        }

        if (stations.length > 0) {
            return [stations[0].lat, stations[0].lng]
        }

        return GERMANY_CENTER
    }, [filteredStations, selectedStation, stations])

    const zoomLevel = DEFAULT_ZOOM
    const showEmptyState = !loading && !error && filteredStations.length === 0

    return (
        <div className="relative h-[520px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-cyan-500/5">
            {loading && (
                <div className="absolute left-4 top-4 z-[1000] rounded-full bg-slate-900/90 px-4 py-2">
                    <LoadingState message="Loading map data..." />
                </div>
            )}
            {error && (
                <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-rose-400/30 bg-rose-900/20 px-4 py-3 text-rose-100">
                    {error}
                </div>
            )}
            {showEmptyState && (
                <div className="absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-900/90 px-5 py-3 text-slate-200">
                    No stations for this city. Clear the filter to see all
                    markers.
                </div>
            )}

            <MapContainer
                className="h-full w-full"
                center={mapCenter}
                zoom={zoomLevel}
                scrollWheelZoom
            >
                <MapController
                    selectedStation={selectedStation}
                    filteredStations={filteredStations}
                    allStations={stations}
                />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredStations.map((station) => (
                    <StationMarker
                        key={station.id}
                        station={station}
                        isSelected={station.id === selectedStationId}
                        onSelect={setSelectedStation}
                    />
                ))}
            </MapContainer>
        </div>
    )
}

export default MapView
