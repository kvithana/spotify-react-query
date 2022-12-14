import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useLoaders } from "../client"

/**
 * Returns a query for a simplified track object from the Spotify API. This will
 * leverage the cache better that `useFullTrack` if used in combination with
 * fetching Playlists, Albums, etc which fetches simplified track data already.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 * @param id Spotify track URI
 */
export function useSimplifiedTrack(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.TrackObjectSimplified, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { track } = useLoaders()
  return useQuery(["track", "simplified", id], () => track.load(id), options)
}

/**
 * Returns a query for a full track object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/
 * @param id Spotify track URI
 */
export function useFullTrack(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.TrackObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { track } = useLoaders()
  return useQuery(["track", "full", id], () => track.load(id), options)
}
