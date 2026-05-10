import { useQueries, useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useLoaders } from "../client"
import { config } from "../query-config"

/**
 * Returns a query for a simplified track object from the Spotify API. This will
 * leverage the cache better than `useFullTrack` if used in combination with
 * fetching Playlists, Albums, etc which fetches simplified track data already.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 * @param id Spotify track ID
 */
export function useSimplifiedTrack(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.TrackObjectSimplified, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { track } = useLoaders()
  return useQuery({
    queryKey: ["track", "simplified", id],
    queryFn: () => track.load(id),
    ...config(options),
  })
}

/**
 * Returns a query for a full track object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 * @param id Spotify track ID
 */
export function useFullTrack(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.TrackObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { track } = useLoaders()
  return useQuery({
    queryKey: ["track", "full", id],
    queryFn: () => track.load(id),
    ...config(options),
  })
}

/**
 * Returns parallel queries for multiple full track objects from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 * @param ids Spotify track IDs
 */
export function useFullTracks(
  ids: string[],
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.TrackObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { track } = useLoaders()
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["track", "full", id],
      queryFn: () => track.load(id),
      ...config(options),
    })),
  })
}
