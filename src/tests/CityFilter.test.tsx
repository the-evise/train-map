// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CityFilter from '../components/CityFilter'
import { useStations } from '../hooks/useStations'

vi.mock('../hooks/useStations', () => ({
    useStations: vi.fn(),
}))

const mockUseStations = vi.mocked(useStations)

const createStationsState = (
    overrides: Partial<ReturnType<typeof useStations>> = {},
) =>
    ({
        stations: [],
        filteredStations: [],
        selectedStationId: null,
        selectedStation: null,
        cityFilter: '',
        cities: [],
        loading: false,
        error: null,
        setCityFilter: vi.fn(),
        setSelectedStation: vi.fn(),
        clearFilter: vi.fn(),
        refresh: vi.fn(),
        ...overrides,
    }) as ReturnType<typeof useStations>

describe('CityFilter', () => {
    beforeEach(() => {
        mockUseStations.mockReturnValue(createStationsState())
    })

    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('renders cities and updates the selected filter', () => {
        const setCityFilter = vi.fn()
        mockUseStations.mockReturnValue(
            createStationsState({
                cities: ['Berlin', 'Hamburg'],
                setCityFilter,
            }),
        )

        render(<CityFilter />)

        const select = screen.getByLabelText('City') as HTMLSelectElement
        expect(select.value).toBe('')
        expect(screen.getByRole('option', { name: 'Berlin' })).toBeTruthy()
        expect(screen.getByRole('option', { name: 'Hamburg' })).toBeTruthy()

        fireEvent.change(select, { target: { value: 'Berlin' } })
        expect(setCityFilter).toHaveBeenCalledWith('Berlin')
    })

    it('clears the filter when requested', () => {
        const clearFilter = vi.fn()
        mockUseStations.mockReturnValue(
            createStationsState({
                cityFilter: 'Berlin',
                clearFilter,
            }),
        )

        render(<CityFilter />)

        const button = screen.getByRole('button', { name: 'Clear' })
        expect(button).toBeTruthy()
        expect(button).toHaveProperty('disabled', false)

        fireEvent.click(button)
        expect(clearFilter).toHaveBeenCalledTimes(1)
    })
})
