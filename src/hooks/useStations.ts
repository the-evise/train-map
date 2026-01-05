import { useContext } from 'react'
import { StationsContext } from '../context/StationsContext'

export const useStations = () => {
    const context = useContext(StationsContext)

    if (!context) {
        throw new Error('useStations must be used within a StationsProvider')
    }

    return context
}
