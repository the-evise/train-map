import './App.css'
import 'leaflet/dist/leaflet.css'
import CityFilter from './components/CityFilter'
import MapView from './components/MapView'
import StationList from './components/StationList'
import { StationsProvider } from './context/StationsContext'

function App() {
    return (
        <StationsProvider>
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
                    <header className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                            Network Explorer
                        </p>
                        <h1 className="text-3xl font-semibold">
                            Train Stations by City
                        </h1>
                        <p className="max-w-2xl text-sm text-slate-300">
                            Filter the network by city to instantly update both
                            the station list and map markers. Clear the filter
                            anytime to see the full network again.
                        </p>
                    </header>

                    <CityFilter />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <StationList />
                        </div>
                        <div className="lg:col-span-2">
                            <MapView />
                        </div>
                    </div>
                </div>
            </div>
        </StationsProvider>
    )
}

export default App
