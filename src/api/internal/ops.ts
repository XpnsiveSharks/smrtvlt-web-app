import { httpRequest } from '../http'

export type InternalPingResponse = {
  status?: string
  detail?: string
  [key: string]: unknown
}

export function getPing(authToken?: string): Promise<InternalPingResponse | null> {
  return httpRequest<InternalPingResponse>('/internal/ping', {
    method: 'GET',
    authToken,
  })
}