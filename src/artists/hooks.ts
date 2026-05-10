import { useQueries, useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useLoaders } from "../client"
import { config } from "../query-config"

/**
 * Returns a query for a simplified artist object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
 * @param id Spotify artist ID
 */
export function useSimplifiedArtist(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.ArtistObjectSimplified, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { artist } = useLoaders()
  return useQuery({
    queryKey: ["artist", "simplified", id],
    queryFn: () => artist.load(id),
    ...config(options),
  })
}

/**
 * Returns a query for a full artist object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
 * @param id Spotify artist ID
 */
export function useFullArtist(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.ArtistObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { artist } = useLoaders()
  return useQuery({
    queryKey: ["artist", "full", id],
    queryFn: () => artist.load(id),
    ...config(options),
  })
}

/**
 * Returns parallel queries for multiple full artist objects from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
 * @param ids Spotify artist IDs
 */
export function useFullArtists(
  ids: string[],
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.ArtistObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { artist } = useLoaders()
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["artist", "full", id],
      queryFn: () => artist.load(id),
      ...config(options),
    })),
  })
}
