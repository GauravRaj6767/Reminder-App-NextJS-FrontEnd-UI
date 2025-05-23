const { cookies } = require("next/headers")


const TOKEN_AGE = 3600
const TOKEN_NAME = 'auth-token'
const TOKEN_REFRESH_NAME = 'auth-refresh-token'

export function getToken() {
    // api requests will use tokens hence get them first
    const myAuthToken = cookies().get(TOKEN_NAME)
    return myAuthToken?.value
}

export function getRefreshToken() {
    // api requests will use tokens hence get them first
    const myAuthToken = cookies().get(TOKEN_REFRESH_NAME)
    return myAuthToken?.value
}

export function setAccessToken(authToken) {
    // login will set the auth access token which can be used later 
    return cookies().set({
        name: TOKEN_NAME,
        value: authToken,
        httpOnly: true,   // limit client side js
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_AGE,
    })
}

export function setRefreshToken(authRefreshToken) {
    // login will set the auth refresh token which can be used later 
    return cookies().set({
        name: TOKEN_REFRESH_NAME,
        value: authRefreshToken,
        httpOnly: true,   // limit client side js
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_AGE,
    })
}

export function deleteTokens() {
    // logout should remove auth token 
    cookies().delete(TOKEN_REFRESH_NAME)
    return cookies().delete(TOKEN_NAME)
}