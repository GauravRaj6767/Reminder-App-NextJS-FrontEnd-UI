// url -> login (router for login in url)
"use client"

import { useAuth } from "@/components/authProvider"

//const LOGIN_URL = "http://127.0.0.1:8001/api/token/pair"
const LOGIN_URL = "/api/login"


export default function Page() {
    const auth = useAuth()

    async function handleSubmit(event) {
        event.preventDefault()
        console.log(event, event.target)

        const formData = new FormData(event.target)
        const formObject = Object.fromEntries(formData)
        const jsonData = JSON.stringify(formObject)

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData,
        }

        const response = await fetch(LOGIN_URL, requestOptions)
        const data = await response.json()
        console.log(data)
        if (response.ok) {
            console.log("LOGGED IN !!!!")
            auth.login()
        }
    }

    return <div>
        <h1>LOGIN PAGE</h1>

        <form onSubmit={handleSubmit}>
            <input type="text" required name="username" placeholder="Your Username" />
            <input type="password" required name="password" placeholder="Your Password" />
            <button type="submit" >Login Button </button>
        </form>

    </div>
}

