import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useMemo } from "react"
import SpotifyWebApi from "spotify-web-api-node"
import { AlbumLoader, createAlbumLoader } from "./albums/loader"
import { ArtistLoader, createArtistLoader } from "./artists/loader"
import { createTrackLoader, TrackLoader } from "./tracks/loader"

export type SpotifyQueryContextType = {
  client: SpotifyWebApi
  loaders: {
    track: TrackLoader
    album: AlbumLoader
    artist: ArtistLoader
  }
}

export const SpotifyQueryContext = React.createContext<SpotifyQueryContextType | null>(null)

export function SpotifyQueryProvider({
  accessToken,
  client,
  children,
}: {
  accessToken: string
  client: QueryClient
  children: React.ReactNode
}) {
  const spotify = useMemo(() => {
    const client = new SpotifyWebApi()
    client.setAccessToken(accessToken)
    return client
  }, [accessToken])

  const loaders = useMemo(() => {
    return {
      track: createTrackLoader(spotify),
      album: createAlbumLoader(spotify, client),
      artist: createArtistLoader(spotify),
    }
  }, [spotify])

  const value = useMemo(() => {
    return {
      client: spotify,
      loaders,
    }
  }, [spotify, loaders])

  return (
    <SpotifyQueryContext.Provider value={value}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </SpotifyQueryContext.Provider>
  )
}

export function useLoaders() {
  const context = React.useContext(SpotifyQueryContext)
  if (!context) {
    throw new Error("`useLoaders` must be used within a `<SpotifyQueryProvider />`")
  }
  return context.loaders
}

export function useSpotifyClient() {
  const context = React.useContext(SpotifyQueryContext)
  if (!context) {
    throw new Error("`useSpotifyClient` must be used within a `<SpotifyQueryProvider />`")
  }
  return context.client
}
