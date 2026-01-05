import {
    createContext,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { fetchStations } from '../api/stations'
import type { Station } from '../types/station'

type StationsContextValue = {
    stations: Station[]
    filteredStations: Station[]
    selectedStationId: number | null
    selectedStation: Station | null
    cityFilter: string
    cities: string[]
    loading: boolean
    error: string | null
    setCityFilter: (city: string) => void
    setSelectedStation: (id: number | null) => void
    clearFilter: () => void
    refresh: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const StationsContext = createContext<StationsContextValue | undefined>(
    undefined,
)

export const StationsProvider = ({ children }: { children: ReactNode }) => {
    const [stations, setStations] = useState<Station[]>([])
    const [cityFilter, setCityFilter] = useState<string>('')
    const [selectedStationId, setSelectedStationId] = useState<number | null>(
        null,
    )
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const activeRequestRef = useRef<{
        id: number
        controller: AbortController
    } | null>(null)
    const requestIdRef = useRef<number>(0)

    const loadStations = useCallback(
        async (controller?: AbortController) => {
            const abortController = controller ?? new AbortController()
            const requestId = requestIdRef.current + 1
            requestIdRef.current = requestId
            activeRequestRef.current?.controller.abort()
            activeRequestRef.current = { id: requestId, controller: abortController }

            setLoading(true)
            setError(null)

            try {
                const data = await fetchStations(abortController.signal)
                const isLatest =
                    activeRequestRef.current?.id === requestId &&
                    !abortController.signal.aborted

                if (isLatest) {
                    setStations(data)
                }
            } catch (err) {
                if (abortController.signal.aborted) {
                    return
                }
                const isLatest = activeRequestRef.current?.id === requestId

                if (isLatest) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to load stations.',
                    )
                }
            } finally {
                const isLatest =
                    activeRequestRef.current?.id === requestId &&
                    !abortController.signal.aborted

                if (isLatest) {
                    activeRequestRef.current = null
                    setLoading(false)
                }
            }

            return abortController
        },
        [],
    )

    useEffect(() => {
        const controller = new AbortController()
        void loadStations(controller)

        return () => controller.abort()
    }, [loadStations])

    const filteredStations = useMemo(() => {
        if (!cityFilter) {
            return stations
        }

        return stations.filter((station) => station.city === cityFilter)
    }, [stations, cityFilter])

    const selectedStation = useMemo(() => {
        if (!selectedStationId) {
            return null
        }

        return (
            stations.find((station) => station.id === selectedStationId) ?? null
        )
    }, [selectedStationId, stations])

    const cities = useMemo(() => {
        const uniqueCities = new Set(stations.map((station) => station.city))
        return Array.from(uniqueCities).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' }),
        )
    }, [stations])

    useEffect(() => {
        if (
            selectedStationId &&
            !filteredStations.some((station) => station.id === selectedStationId)
        ) {
            setSelectedStationId(null)
        }
    }, [filteredStations, selectedStationId])

    const clearFilter = useCallback(() => setCityFilter(''), [])
    const refresh = useCallback(() => {
        void loadStations()
    }, [loadStations])

    const contextValue = useMemo(
        () => ({
            stations,
            filteredStations,
            selectedStationId,
            selectedStation,
            cityFilter,
            cities,
            loading,
            error,
            setCityFilter,
            setSelectedStation: setSelectedStationId,
            clearFilter,
            refresh,
        }),
        [
            stations,
            filteredStations,
            selectedStationId,
            selectedStation,
            cityFilter,
            cities,
            loading,
            error,
            clearFilter,
            refresh,
        ],
    )

    return (
        <StationsContext.Provider value={contextValue}>
            {children}
        </StationsContext.Provider>
    )
}
