import { useEffect, useMemo, useRef } from 'react'
import { divIcon, Icon, type Marker as LeafletMarker } from 'leaflet'
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from 'react-leaflet'
import LoadingState from './LoadingState'
import { useStations } from '../hooks/useStations'
import type { Station } from '../types/station'

const markerIcon = new Icon({
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url)
        .href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url)
        .href,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const selectedMarkerIcon = divIcon({
    className: 'selected-marker-icon',
    html: '<div class="selected-marker-pulse"></div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
})

const GERMANY_CENTER: [number, number] = [51.1657, 10.4515]
const DEFAULT_ZOOM = 6

const RecenterMap = ({ center }: { center: [number, number] }) => {
    const map = useMap()

    useEffect(() => {
        map.setView(center)
    }, [map, center])

    return null
}

const FlyToSelected = ({ station }: { station: Station | null }) => {
    const map = useMap()

    useEffect(() => {
        if (!station) {
            return
        }

        map.flyTo([station.lat, station.lng], Math.max(map.getZoom(), 9), {
            duration: 0.75,
        })
    }, [station, map])

    return null
}

type StationMarkerProps = {
    station: Station
    isSelected: boolean
    onSelect: (id: number) => void
}

const StationMarker = ({ station, isSelected, onSelect }: StationMarkerProps) => {
    const markerRef = useRef<LeafletMarker | null>(null)

    useEffect(() => {
        if (!markerRef.current) {
            return
        }

        if (isSelected) {
            markerRef.current.openPopup()
        } else {
            markerRef.current.closePopup()
        }
    }, [isSelected])

    return (
        <Marker
            ref={markerRef}
            position={[station.lat, station.lng]}
            icon={isSelected ? selectedMarkerIcon : markerIcon}
            eventHandlers={{
                click: () => onSelect(station.id),
            }}
        >
            <Popup>
                <p className="font-semibold">{station.name}</p>
                <p className="text-sm text-slate-600">{station.city}</p>
            </Popup>
        </Marker>
    )
}

const MapView = () => {
    const {
        filteredStations,
        loading,
        error,
        cityFilter,
        selectedStationId,
        selectedStation,
        setSelectedStation,
    } = useStations()

    const mapCenter: [number, number] = useMemo(() => {
        if (selectedStation) {
            return [selectedStation.lat, selectedStation.lng]
        }

        if (cityFilter && filteredStations.length > 0) {
            return [filteredStations[0].lat, filteredStations[0].lng]
        }

        return GERMANY_CENTER
    }, [cityFilter, filteredStations, selectedStation])

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
                <RecenterMap center={mapCenter} />
                <FlyToSelected station={selectedStation} />
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
