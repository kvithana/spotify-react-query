import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query"
import { useSpotifyClient } from "../client"
import { getError } from "../errors"
import { config } from "../query-config"
import { addTracksToCache } from "../tracks/cache"
import { until } from "../utils/until"
import { waitForNewToken } from "../utils/wait-for-new-token"

/**
 * Get a playlist owned by a Spotify user.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist
 * @param id Spotify playlist ID
 */
export function usePlaylist(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.PlaylistObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  return useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      await until(() => !!client.getAccessToken())
      let response = await client.getPlaylist(id)

      if (response.statusCode === 401) {
        await waitForNewToken(client).catch(() => {})
        response = await client.getPlaylist(id)
      }

      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }

      if (response.body.tracks.items) {
        addTracksToCache(
          query,
          response.body.tracks.items.filter((i) => !!i.track?.uri).map((i) => i.track!)
        )
      }

      return response.body
    },
    ...config(options),
  })
}

/**
 * Get full details of the items of a playlist owned by a Spotify user.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks
 */
export function usePlaylistTracks(
  variables: { id: string; fields?: string; limit?: number; offset?: number; market?: string },
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.PlaylistTrackResponse, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  return useQuery({
    queryKey: [
      "playlist:tracks",
      [variables.id, variables.fields, variables.limit, variables.market, variables.offset].join(":"),
    ],
    queryFn: async () => {
      await until(() => !!client.getAccessToken())
      const get = () =>
        client.getPlaylistTracks(variables.id, {
          fields: variables.fields,
          limit: variables.limit,
          offset: variables.offset,
          market: variables.market,
        })

      let response = await get()

      if (response.statusCode === 401) {
        await waitForNewToken(client).catch(() => {})
        response = await get()
      }

      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }

      if (response.body.items) {
        addTracksToCache(
          query,
          response.body.items.filter((i) => !!i.track?.uri).map((i) => i.track!)
        )
      }

      return response.body
    },
    ...config(options),
  })
}
