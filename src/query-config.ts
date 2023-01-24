import { UseQueryOptions } from "@tanstack/react-query"

export const DEFAULT_QUERY_CONFIG: UseQueryOptions = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: Infinity,
}

export const config = <T>(config?: UseQueryOptions<any, any, T, string[]>): UseQueryOptions<any, any, T, string[]> => {
  return Object.assign({ ...DEFAULT_QUERY_CONFIG }, config)
}
