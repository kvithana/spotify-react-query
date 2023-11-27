import { QueryClient } from "@tanstack/react-query"
import DataLoader from "dataloader"
import SpotifyWebApi from "spotify-web-api-node"
import { getError } from "../errors"
import { addTracksToCache } from "../tracks/cache"
import { until } from "../utils/until"
import { waitForNewToken } from "../utils/wait-for-new-token"

export const fetchAlbums =
  (spotify: SpotifyWebApi, query: QueryClient) =>
  async (keys: readonly string[]): Promise<SpotifyApi.AlbumObjectFull[]> => {
    const remaining = [...keys]
    const albums: SpotifyApi.AlbumObjectFull[] = []

    await until(() => !!spotify.getAccessToken())

    while (remaining.length > 0) {
      const batch = remaining.splice(0, 50)
      let response = await spotify.getAlbums(batch)
      if (response.statusCode === 429) {
        await waitForNewToken(spotify).catch((err) => {})
        response = await spotify.getAlbums(batch)
      }
      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }
      for (const album of response.body.albums) {
        if (album) addTracksToCache(query, album.tracks.items)
      }
      albums.push(...response.body.albums.map((album) => album ?? new Error("Album not found")))
    }

    return albums
  }

export const createAlbumLoader = (spotify: SpotifyWebApi, query: QueryClient) =>
  new DataLoader<string, SpotifyApi.AlbumObjectFull>(fetchAlbums(spotify, query), { cache: false })

export type AlbumLoader = ReturnType<typeof createAlbumLoader>
