import { UseQueryOptions } from "@tanstack/react-query"

export const DEFAULT_QUERY_CONFIG: Omit<
  UseQueryOptions<any, any, any, string[]>,
  "queryKey" | "queryFn" | "initialData"
> = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: Infinity,
}

export const config = <T>(config?: UseQueryOptions<any, any, T, string[]>) => {
  return Object.assign({ ...DEFAULT_QUERY_CONFIG }, config)
}
