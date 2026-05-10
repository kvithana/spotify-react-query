import DataLoader from "dataloader"
import { getError } from "../errors"
import type { SpotifyClient } from "../types"
import { until } from "../utils/until"
import { waitForNewToken } from "../utils/wait-for-new-token"

export const fetchTracks =
  (client: SpotifyClient) =>
  async (keys: readonly string[]): Promise<SpotifyApi.TrackObjectFull[]> => {
    const remaining = [...keys]
    const tracks: SpotifyApi.TrackObjectFull[] = []

    await until(() => !!client.getAccessToken())

    while (remaining.length > 0) {
      const batch = remaining.splice(0, 50)
      let response = await client.getTracks(batch)
      if (response.statusCode === 401) {
        await waitForNewToken(client).catch(() => {})
        response = await client.getTracks(batch)
      }
      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }
      tracks.push(...response.body.tracks.map((track) => track ?? new Error("Track not found")))
    }

    return tracks
  }

export const createTrackLoader = (client: SpotifyClient) =>
  new DataLoader<string, SpotifyApi.TrackObjectFull>(fetchTracks(client), { cache: false })

export type TrackLoader = ReturnType<typeof createTrackLoader>
