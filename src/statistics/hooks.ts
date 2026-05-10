import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query"
import { addArtistsToCache } from "../artists/cache"
import { useSpotifyClient } from "../client"
import { getError } from "../errors"
import { config } from "../query-config"
import { addTracksToCache } from "../tracks/cache"
import { until } from "../utils/until"
import { waitForNewToken } from "../utils/wait-for-new-token"

type TimeRange = "short_term" | "medium_term" | "long_term"

/**
 * Get the current user's top tracks based on calculated affinity.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 */
export function useUserTopTracks(
  variables: { limit?: number; offset?: number; time_range: TimeRange },
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.UsersTopTracksResponse, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  return useQuery({
    queryKey: ["top-tracks", [variables.time_range, variables.limit, variables.offset].join(":")],
    queryFn: async () => {
      await until(() => !!client.getAccessToken())
      let response = await client.getMyTopTracks(variables)

      if (response.statusCode === 401) {
        await waitForNewToken(client).catch(() => {})
        response = await client.getMyTopTracks(variables)
      }

      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }

      if (response.body.items) {
        addTracksToCache(
          query,
          response.body.items.filter((i) => !!i?.uri)
        )
      }

      return response.body
    },
    ...config(options),
  })
}

/**
 * Get the current user's top artists based on calculated affinity.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 */
export function useUserTopArtists(
  variables: { limit?: number; offset?: number; time_range: TimeRange },
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.UsersTopArtistsResponse, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  return useQuery({
    queryKey: ["top-artists", [variables.time_range, variables.limit, variables.offset].join(":")],
    queryFn: async () => {
      await until(() => !!client.getAccessToken())
      let response = await client.getMyTopArtists(variables)

      if (response.statusCode === 401) {
        await waitForNewToken(client).catch(() => {})
        response = await client.getMyTopArtists(variables)
      }

      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }

      if (response.body.items) {
        addArtistsToCache(
          query,
          response.body.items.filter((i) => !!i?.uri)
        )
      }

      return response.body
    },
    ...config(options),
  })
}

/**
 * Get tracks from the current user's recently played tracks. Note: currently
 * doesn't support podcast episodes.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
 */
export function useRecentlyPlayedTracks(
  variables: { after?: number; before?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.UsersRecentlyPlayedTracksResponse, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  return useQuery({
    queryKey: ["recent-tracks", [variables.after, variables.before, variables.limit].join(":")],
    queryFn: async () => {
      await until(() => !!client.getAccessToken())
      let response = await client.getMyRecentlyPlayedTracks(variables)

      if (response.statusCode === 401) {
        await waitForNewToken(client).catch(() => {})
        response = await client.getMyRecentlyPlayedTracks(variables)
      }

      if (response.statusCode !== 200) {
        throw getError(response.statusCode, response.body)
      }

      if (response.body.items) {
        addTracksToCache(
          query,
          response.body.items.filter((i) => !!i?.track.uri).map((i) => i.track)
        )
      }

      return response.body
    },
    ...config(options),
  })
}
