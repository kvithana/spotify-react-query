import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useLoaders } from "../client"

/**
 * Returns a query for a simplified artist object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
 * @param id Spotify artist URI
 */
export function useSimplifiedArtist(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.ArtistObjectSimplified, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { artist } = useLoaders()
  return useQuery(["artist", "simplified", id], () => artist.load(id), options)
}

/**
 * Returns a query for a full artist object from the Spotify API.
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artist
 * @param id Spotify artist URI
 */
export function useFullArtist(
  id: string,
  options?: Omit<
    UseQueryOptions<any, any, SpotifyApi.ArtistObjectFull, string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) {
  const { artist } = useLoaders()
  return useQuery(["artist", "full", id], () => artist.load(id), options)
}
