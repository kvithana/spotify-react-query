import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { addArtistsToCache } from "../artists/cache"
import { useSpotifyClient } from "../client"
import { getError } from "../errors"
import { config } from "../query-config"
import { addTracksToCache } from "../tracks/cache"
import { until } from "../utils/until"
import { waitForNewToken } from "../utils/wait-for-new-token"

/**
 * Get the current user's top tracks based on calculated affinity.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 * @param variables - time_range, limit, offset
 */
export function useUserTopTracks(
  variables: { limit?: number; offset?: number; time_range: "short_term" | "medium_term" | "long_term" },
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.UsersTopTracksResponse, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  const loader = async () => {
    await until(() => !!client.getAccessToken())
    let response = await client.getMyTopTracks(variables)

    if (response.statusCode === 401) {
      await waitForNewToken(client).catch((err) => {})
      response = await client.getMyTopTracks(variables)
    }

    if (response.statusCode !== 200) {
      throw getError(response.statusCode, response.body)
    }
    if (response.body.items) {
      addTracksToCache(
        query,
        response.body.items.filter((i) => !!i?.uri).map((i) => i)
      )
    }
    return response.body
  }

  return useQuery(
    ["top-tracks", [variables.time_range, variables.limit, variables.offset].join(":")],
    loader,
    config(options)
  )
}

/**
 * Get the current user's top artists based on calculated affinity.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
 * @param variables - time_range, limit, offset
 */
export function useUserTopArtists(
  variables: { limit?: number; offset?: number; time_range: "short_term" | "medium_term" | "long_term" },
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.UsersTopArtistsResponse, any[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const client = useSpotifyClient()
  const query = useQueryClient()

  const loader = async () => {
    await until(() => !!client.getAccessToken())
    let response = await client.getMyTopArtists(variables)

    if (response.statusCode === 401) {
      await waitForNewToken(client).catch((err) => {})
      response = await client.getMyTopArtists(variables)
    }

    if (response.statusCode !== 200) {
      throw getError(response.statusCode, response.body)
    }
    if (response.body.items) {
      addArtistsToCache(
        query,
        response.body.items.filter((i) => !!i?.uri).map((i) => i)
      )
    }
    return response.body
  }

  return useQuery(
    ["top-artists", [variables.time_range, variables.limit, variables.offset].join(":")],
    loader,
    config(options)
  )
}

/**
 * Get tracks from the current user's recently played tracks. Note: Currently doesn't support podcast episodes.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recently-played
 * @param variables - after, before, limit
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

  const loader = async () => {
    await until(() => !!client.getAccessToken())
    let response = await client.getMyRecentlyPlayedTracks(variables)

    if (response.statusCode === 401) {
      await waitForNewToken(client).catch((err) => {})
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
  }

  return useQuery(
    ["recent-tracks", [variables.after, variables.before, variables.limit].join(":")],
    loader,
    config(options)
  )
}
