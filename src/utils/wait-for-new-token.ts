import SpotifyWebApi from "spotify-web-api-node"
import { until } from "./until"

export async function waitForNewToken(client: SpotifyWebApi) {
  const current = client.getAccessToken()
  // wait for up to 10 seconds for a new token to be fetched, otherwise continue
  await until(() => client.getAccessToken() !== current, {
    timeout: 10e3,
  })
}
