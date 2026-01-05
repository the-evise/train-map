// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CityFilter from '../components/CityFilter'
import StationList from '../components/StationList'
import { StationsProvider } from '../context/StationsContext'
import type { Station } from '../types/station'
import { fetchStations } from '../api/stations'

vi.mock('../api/stations', () => ({
    fetchStations: vi.fn(),
}))

const mockStations: Station[] = [
    { id: 1, name: 'Berlin Hbf', city: 'Berlin', lat: 52.5251, lng: 13.3694 },
    { id: 2, name: 'Hamburg Hbf', city: 'Hamburg', lat: 53.553, lng: 10.0067 },
    { id: 3, name: 'Berlin Ostbahnhof', city: 'Berlin', lat: 52.5108, lng: 13.4348 },
]

describe('Stations integration', () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('filters the station list when a city is selected', async () => {
        vi.mocked(fetchStations).mockResolvedValue(mockStations)

        render(
            <StationsProvider>
                <CityFilter />
                <StationList />
            </StationsProvider>,
        )

        await screen.findByText('Berlin Hbf')
        expect(screen.getAllByRole('listitem')).toHaveLength(3)

        const select = screen.getByLabelText('City')
        fireEvent.change(select, { target: { value: 'Berlin' } })

        await waitFor(() => {
            expect(screen.getAllByRole('listitem')).toHaveLength(2)
        })
        expect(screen.queryByText('Hamburg Hbf')).toBeNull()
    })
})
