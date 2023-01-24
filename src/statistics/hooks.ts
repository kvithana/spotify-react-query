import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { addArtistsToCache } from "../artists/cache"
import { useSpotifyClient } from "../client"
import { getError } from "../errors"
import { config } from "../query-config"
import { addTracksToCache } from "../tracks/cache"
import { until } from "../utils/until"

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
    return client.getMyTopTracks(variables).then((res) => {
      if (res.statusCode !== 200) {
        throw getError(res.statusCode, res.body)
      }
      if (res.body.items) {
        addTracksToCache(
          query,
          res.body.items.filter((i) => !!i?.uri).map((i) => i!)
        )
      }
      return res.body
    })
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
    return client.getMyTopArtists(variables).then((res) => {
      if (res.statusCode !== 200) {
        throw getError(res.statusCode, res.body)
      }
      if (res.body.items) {
        addArtistsToCache(
          query,
          res.body.items.filter((i) => !!i?.uri).map((i) => i!)
        )
      }
      return res.body
    })
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
    return client.getMyRecentlyPlayedTracks(variables).then((res) => {
      if (res.statusCode !== 200) {
        throw getError(res.statusCode, res.body)
      }
      if (res.body.items) {
        addTracksToCache(
          query,
          res.body.items.filter((i) => !!i?.track.uri).map((i) => i.track!)
        )
      }
      return res.body
    })
  }

  return useQuery(
    ["recent-tracks", [variables.after, variables.before, variables.limit].join(":")],
    loader,
    config(options)
  )
}
