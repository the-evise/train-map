import { useEffect, useRef } from 'react'
import { divIcon, Icon, type Marker as LeafletMarker } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import type { Station } from '../../types/station'

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

type StationMarkerProps = {
    station: Station
    isSelected: boolean
    onSelect: (id: number) => void
}

const StationMarker = ({
    station,
    isSelected,
    onSelect,
}: StationMarkerProps) => {
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

export default StationMarker
