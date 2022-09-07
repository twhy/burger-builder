import { ACCESS_TOKEN_KEY, NINE_MINUTES_THIRTY_SECONDS } from './contants'

export type Token = {
  value: string | undefined
  expires: string | number | undefined
}

export function setToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify({
    value: token,
    expires: Date.now() + NINE_MINUTES_THIRTY_SECONDS  // Token expires in 10 minutes
  }))
}

export function delToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getToken() {
  return JSON.parse(localStorage.getItem(ACCESS_TOKEN_KEY) || '{}') as Token
}

export function isTokenValid(token: Token) {
  if (!token.value || !token.expires) return false
  return token.value && +token.expires > Date.now()
}