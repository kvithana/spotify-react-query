import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useEffect, useMemo } from "react"
import type SpotifyWebApi from "spotify-web-api-node"
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
  query,
  spotify,
  children,
}: {
  accessToken: string | null
  query: QueryClient
  spotify: SpotifyWebApi
  children: React.ReactNode
}) {
  useEffect(() => {
    if (accessToken) {
      spotify.setAccessToken(accessToken)
    } else {
      spotify.resetAccessToken()
    }
  }, [accessToken])

  const loaders = useMemo(() => {
    return {
      track: createTrackLoader(spotify),
      album: createAlbumLoader(spotify, query),
      artist: createArtistLoader(spotify),
    }
  }, [])

  const value = useMemo(() => {
    return {
      client: spotify,
      loaders,
    }
  }, [loaders])

  return (
    <SpotifyQueryContext.Provider value={value}>
      <QueryClientProvider client={query}>{children}</QueryClientProvider>
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
