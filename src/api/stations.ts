import type {Station} from '../types/station'

const STATIONS_URL =
  'https://gist.githubusercontent.com/neysidev/bbd40032f0f4e167a1e6a8b3e99a490c/raw/train-stations.json'

const isStation = (value: unknown): value is Station => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.id === 'number' &&
    typeof record.name === 'string' &&
    typeof record.city === 'string' &&
    typeof record.lat === 'number' &&
    typeof record.lng === 'number'
  )
}

export const fetchStations = async (
  signal?: AbortSignal,
): Promise<Station[]> => {
  const response = await fetch(STATIONS_URL, { signal })

  if (!response.ok) {
    throw new Error(
      `Failed to load stations: ${response.status} ${response.statusText}`,
    )
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Stations response is not an array.')
  }

  if (!data.every(isStation)) {
    throw new Error('Stations response has invalid entries.')
  }

  return data
}
