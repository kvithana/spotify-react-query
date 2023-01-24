import { QueryClient } from "@tanstack/react-query"

export function addArtistsToCache(client: QueryClient, artists: SpotifyApi.ArtistObjectSimplified[]) {
  for (const artist of artists) {
    client.setQueryData(["artist", "simplified", artist.id], artist)
  }
}
