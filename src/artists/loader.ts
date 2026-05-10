import DataLoader from "dataloader"
import { getError } from "../errors"
import type { SpotifyClient } from "../types"
import { until } from "../utils/until"
import { waitForNewToken } from "../utils/wait-for-new-token"

export const fetchArtists =
  (spotify: SpotifyClient) =>
  async (keys: readonly string[]): Promise<SpotifyApi.ArtistObjectFull[]> => {
    const remaining = [...keys]
    const artists: SpotifyApi.ArtistObjectFull[] = []

    await until(() => !!spotify.getAccessToken())

    while (remaining.length > 0) {
      const batch = remaining.splice(0, 50)
      let response = await spotify.getArtists(batch)
      if (response.statusCode === 401) {
        await waitForNewToken(spotify).catch(() => {})
        response = await spotify.getArtists(batch)
      }
      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }
      artists.push(...response.body.artists.map((artist) => artist ?? new Error("Artist not found")))
    }

    return artists
  }

export const createArtistLoader = (client: SpotifyClient) =>
  new DataLoader<string, SpotifyApi.ArtistObjectFull>(fetchArtists(client), { cache: false })

export type ArtistLoader = ReturnType<typeof createArtistLoader>
