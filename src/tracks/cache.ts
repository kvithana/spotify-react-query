import { QueryClient } from "@tanstack/react-query"

export function addTracksToCache(client: QueryClient, tracks: SpotifyApi.TrackObjectSimplified[]) {
  for (const track of tracks) {
    client.setQueryData(["track", "simplified", track.id], track)
  }
}
