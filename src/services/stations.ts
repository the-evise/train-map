import type { Station } from '../types/station'

export const filterStationsByCity = (
    stations: Station[],
    city: string,
): Station[] => {
    if (!city) {
        return stations
    }

    return stations.filter((station) => station.city === city)
}

export const getCityList = (stations: Station[]): string[] => {
    const uniqueCities = new Set(stations.map((station) => station.city))

    return Array.from(uniqueCities).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }),
    )
}
