import Cookies from 'js-cookie'

const TokenKey = 'jwt_token'
const Sub = 'dz_sub'
const Code = 'code'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getSub() {
  return Cookies.get(Sub)
}

export function setSub(sub) {
  return Cookies.set(Sub, sub)
}

export function removeSub() {
  return Cookies.remove(Sub)
}

export function getCode() {
  return Cookies.get(Code)
}

export function setCode(code) {
  return Cookies.set(Code, code)
}

export function removeCode() {
  return Cookies.remove(Code)
}
