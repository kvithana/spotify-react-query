import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
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

  const loader = async (id: string) => {
    await until(() => !!client.getAccessToken())
    let response = await client.getPlaylist(id)

    if (response.statusCode === 401) {
      await waitForNewToken(client).catch((err) => {})
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
  }

  return useQuery(["playlist", id], () => loader(id), config(options))
}

/**
 * Get full details of the items of a playlist owned by a Spotify user.
 * Parameters can be passed into `options.variables`.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks
 * @param id Spotify playlist ID
 */
export function usePlaylistTracks(
  variables: { id: string; fields?: string; limit?: number; offset?: number; market?: string },
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.PlaylistTrackObject[], any[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  const loader = async () => {
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
      await waitForNewToken(client).catch((err) => {})
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
  }

  return useQuery(
    [
      "playlist:tracks",
      [variables.id, variables.fields, variables.limit, variables.market, variables.offset].join(":"),
    ],
    loader,
    config(options)
  )
}
