// url -> login (router for login in url)
"use client"

import { useAuth } from "@/components/authProvider"

//const LOGIN_URL = "http://127.0.0.1:8001/api/token/pair"
const LOGOUT_URL = "/api/logout"


export default function Page() {
    const auth = useAuth()

    async function handleClick(event) {
        event.preventDefault()
        console.log(event, event.target)

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: "",
        }

        const response = await fetch(LOGOUT_URL, requestOptions)
        if (response.ok) {
            console.log("LOGGED OUT !!!!")
            auth.logout()
        }
    }

    return <div>
        <h1>Click To Logout !!</h1>
        <button onClick={handleClick} >Logout Button </button>
    </div>
}

