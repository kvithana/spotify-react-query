import DataLoader from "dataloader"
import SpotifyWebApi from "spotify-web-api-node"
import { getError } from "../errors"
import { until } from "../utils/until"

export const fetchTracks =
  (client: SpotifyWebApi) =>
  async (keys: readonly string[]): Promise<SpotifyApi.TrackObjectFull[]> => {
    const remaining = [...keys]
    const tracks: SpotifyApi.TrackObjectFull[] = []

    await until(() => !!client.getAccessToken())

    while (remaining.length > 0) {
      const batch = remaining.splice(0, 50)
      const response = await client.getTracks(batch)
      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }
      tracks.push(...response.body.tracks.map((track) => track ?? new Error("Track not found")))
    }

    return tracks
  }

export const createTrackLoader = (client: SpotifyWebApi) =>
  new DataLoader<string, SpotifyApi.TrackObjectFull>(fetchTracks(client), { cache: false })

export type TrackLoader = ReturnType<typeof createTrackLoader>
