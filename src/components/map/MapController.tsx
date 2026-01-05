import { useEffect, useRef } from 'react'
import { latLngBounds } from 'leaflet'
import { useMap } from 'react-leaflet'
import type { Station } from '../../types/station'

type MapControllerProps = {
    selectedStation: Station | null
    filteredStations: Station[]
    allStations: Station[]
    defaultCenter: [number, number]
    defaultZoom: number
    debounceMs?: number
}

const MapController = ({
    selectedStation,
    filteredStations,
    allStations,
    defaultCenter,
    defaultZoom,
    debounceMs = 150,
}: MapControllerProps) => {
    const map = useMap()
    const debounceRef = useRef<number | null>(null)

    useEffect(() => {
        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current)
        }

        debounceRef.current = window.setTimeout(() => {
            if (selectedStation) {
                map.flyTo(
                    [selectedStation.lat, selectedStation.lng],
                    Math.max(map.getZoom(), 9),
                    { duration: 0.75 },
                )
                return
            }

            const activeStations =
                filteredStations.length > 0 ? filteredStations : allStations

            if (activeStations.length === 0) {
                map.setView(defaultCenter, defaultZoom)
                return
            }

            if (activeStations.length === 1) {
                const [only] = activeStations
                map.setView([only.lat, only.lng], Math.max(map.getZoom(), 9))
                return
            }

            const bounds = latLngBounds(
                activeStations.map((station) => [station.lat, station.lng]),
            )
            map.fitBounds(bounds, {
                padding: [40, 40],
                maxZoom: 8,
            })
        }, debounceMs)

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current)
            }
        }
    }, [
        allStations,
        filteredStations,
        map,
        selectedStation,
        defaultCenter,
        defaultZoom,
        debounceMs,
    ])

    return null
}

export default MapController
