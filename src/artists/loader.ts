import DataLoader from "dataloader"
import SpotifyWebApi from "spotify-web-api-node"
import { getError } from "../errors"

export const fetchArtists =
  (spotify: SpotifyWebApi) =>
  async (keys: readonly string[]): Promise<SpotifyApi.ArtistObjectFull[]> => {
    const remaining = [...keys]
    const artists: SpotifyApi.ArtistObjectFull[] = []

    while (remaining.length > 0) {
      const batch = remaining.splice(0, 50)
      const response = await spotify.getArtists(batch)
      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }
      artists.push(...response.body.artists.map((artist) => artist ?? new Error("Artist not found")))
    }

    return artists
  }

export const createArtistLoader = (client: SpotifyWebApi) =>
  new DataLoader<string, SpotifyApi.ArtistObjectFull>(fetchArtists(client), { cache: false })

export type ArtistLoader = ReturnType<typeof createArtistLoader>
