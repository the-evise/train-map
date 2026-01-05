import type { ChangeEvent } from 'react'
import { useStations } from '../hooks/useStations'

type CityFilterProps = {
    cities: string[]
    cityFilter: string
    loading: boolean
    onChange: (city: string) => void
    onClear: () => void
}

export const CityFilter = ({
    cities,
    cityFilter,
    loading,
    onChange,
    onClear,
}: CityFilterProps) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value)
    }

    return (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex flex-col gap-1">
                <label
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200"
                    htmlFor="city-filter"
                >
                    City
                </label>
                <select
                    id="city-filter"
                    value={cityFilter}
                    onChange={handleChange}
                    disabled={loading || cities.length === 0}
                    className="min-w-[220px] rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 transition focus:border-cyan-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <option value="">All cities</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="button"
                onClick={onClear}
                disabled={!cityFilter}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
                Clear
            </button>
        </div>
    )
}

const CityFilterContainer = () => {
    const { cities, cityFilter, setCityFilter, clearFilter, loading } =
        useStations()

    return (
        <CityFilter
            cities={cities}
            cityFilter={cityFilter}
            loading={loading}
            onChange={setCityFilter}
            onClear={clearFilter}
        />
    )
}

export default CityFilterContainer
