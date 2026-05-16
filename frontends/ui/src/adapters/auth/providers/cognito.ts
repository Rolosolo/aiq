import CognitoProvider from 'next-auth/providers/cognito'
import type { TokenRefreshResult } from './types'

const clientId = process.env.COGNITO_CLIENT_ID || ''
const clientSecret = process.env.COGNITO_CLIENT_SECRET || ''
const issuer = process.env.COGNITO_ISSUER || ''

export const cognitoProvider = CognitoProvider({
  clientId,
  clientSecret,
  issuer,
})

export const refreshCognitoToken = async (refreshToken: string): Promise<TokenRefreshResult> => {
  const url = `${issuer}/oauth2/token`
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  })

  // Basic auth header for Cognito
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    method: 'POST',
    body: params,
  })

  const tokens = await response.json()

  if (!response.ok) {
    throw tokens
  }

  return {
    access_token: tokens.access_token,
    id_token: tokens.id_token,
    expires_in: tokens.expires_in,
    refresh_token: tokens.refresh_token ?? refreshToken,
  }
}
