"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const { createContext, useContext, useState, useEffect } = require("react");

const AuthContext = createContext(null);

const LOGIN_REDIRECT_URL = "/reminders" // after logging in 
const LOGOUT_REDIRECT_URL = "/login" // after logging out
const LOGIN_REQUIRED_URL = "/login" // going to a site that requires user to be logged in

const LOCAL_STORAGE_KEY = "is-logged-in"
const LOCAL_USERNAME_KEY = "username"


export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("")
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()


    useEffect(() => {
        const storedAuthStatus = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (storedAuthStatus) {
            const storedAuthStatusInt = parseInt(storedAuthStatus)
            setIsAuthenticated(storedAuthStatusInt === 1)
        }

        const storedUsername = localStorage.getItem(LOCAL_USERNAME_KEY)
        if (storedUsername) {
            setUsername(storedUsername)
        }
    }, [])

    const login = (username) => {
        setIsAuthenticated(true)
        localStorage.setItem(LOCAL_STORAGE_KEY, "1")
        if (username) {
            localStorage.setItem(LOCAL_USERNAME_KEY, `${username}`)
            setUsername(username)
        }
        else {
            localStorage.removeItem(LOCAL_USERNAME_KEY)
        }
        const nextUrl = searchParams.get("next")
        const invalidNextUrl = ['/login', '/logout']
        const nextUrlValid = nextUrl && nextUrl.startsWith("/") && !invalidNextUrl.includes(nextUrl)
        if (nextUrlValid) {
            router.replace(nextUrl)
            return
        }
        else {
            console.log("---------  " + LOGIN_REDIRECT_URL)
            router.replace(LOGIN_REDIRECT_URL)
            return
        }
    }

    const logout = () => {
        setIsAuthenticated(false)
        localStorage.setItem(LOCAL_STORAGE_KEY, "0")
        router.replace(LOGOUT_REDIRECT_URL)
    }

    const loginRequiredRedirect = () => {
        setIsAuthenticated(false)
        localStorage.setItem(LOCAL_STORAGE_KEY, "0")
        let loginWithNextUrl = `${LOGIN_REQUIRED_URL}?next=${pathname}`
        if (LOGIN_REQUIRED_URL === pathname) {
            loginWithNextUrl = `${LOGIN_REQUIRED_URL}`
        }
        console.log(loginWithNextUrl)
        router.replace(loginWithNextUrl)
    }
    return <AuthContext.Provider value={{ isAuthenticated, login, logout, loginRequiredRedirect, username }}>
        {children}
    </AuthContext.Provider>
}


export function useAuth() {
    return useContext(AuthContext)
}

