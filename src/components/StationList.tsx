import LoadingState from './LoadingState'
import { useStations } from '../hooks/useStations'

const StationList = () => {
    const {
        filteredStations,
        loading,
        error,
        selectedStationId,
        setSelectedStation,
    } = useStations()

    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <LoadingState />
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-900/20 p-5 text-rose-100">
                <p className="font-semibold">Could not load stations.</p>
                <p className="text-sm opacity-80">{error}</p>
            </div>
        )
    }

    if (filteredStations.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-slate-300">
                No stations match this city. Clear the filter to see all
                stations again.
            </div>
        )
    }

    return (
        <div className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-cyan-500/5">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                        Stations
                    </p>
                    <p className="text-sm text-slate-300">
                        Showing {filteredStations.length} result
                        {filteredStations.length === 1 ? '' : 's'}
                    </p>
                </div>
            </div>
            <ul className="divide-y divide-slate-800 overflow-y-auto h-[450px]">
                {filteredStations.map((station) => {
                    const isSelected = station.id === selectedStationId

                    return (
                        <li key={station.id} className="px-5 py-2">
                            <button
                                type="button"
                                onClick={() => setSelectedStation(station.id)}
                                className={`w-full rounded-xl px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                                    isSelected
                                        ? 'border border-cyan-400/60 bg-slate-800/70 shadow-inner shadow-cyan-500/20'
                                        : 'border border-transparent hover:border-slate-700 hover:bg-slate-800/50'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-100">
                                            {station.name}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {station.city}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-slate-400">
                                        <p>
                                            Lat: {station.lat.toFixed(2)} | Lng:{' '}
                                            {station.lng.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default StationList
