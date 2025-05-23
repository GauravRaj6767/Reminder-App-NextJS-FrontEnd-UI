"use server"
import { DJANGO_API_ENDPOINT } from "@/config/defaults"
import { setAccessToken, setRefreshToken } from "@/lib/auth"
import { NextResponse } from "next/server"

// const DJANGO_API_LOGIN_URL = "http://127.0.0.1:8001/api/token/pair"

const DJANGO_API_LOGIN_URL = `${DJANGO_API_ENDPOINT}/token/pair`


export async function POST(request) {

    const requestData = await request.json()
    const jsonData = JSON.stringify(requestData)

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData,
    }

    const response = await fetch(DJANGO_API_LOGIN_URL, requestOptions)
    const responseData = await response.json()

    if (response.ok) {
        console.log("LOGGED IN !!!!")
        const { username, access, refresh } = responseData
        setAccessToken(access)
        setRefreshToken(refresh)
        return NextResponse.json({ "loggedIn": true, "username": username }, { status: 200 })
    }

    // const authToken = cookies().get("auth-token")

    return NextResponse.json({ "loggedIn": false, ...responseData }, { status: 400 })
}


