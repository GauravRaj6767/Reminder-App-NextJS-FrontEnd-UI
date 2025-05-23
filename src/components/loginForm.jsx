"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "./authProvider"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LOGIN_URL = "/api/login"

export function LoginForm({ className, ...props }) {
    const auth = useAuth()
    const [error, setError] = useState("")
    const [shake, setShake] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        const formData = new FormData(event.target)
        const formObject = Object.fromEntries(formData)
        const jsonData = JSON.stringify(formObject)

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonData,
        }

        const response = await fetch(LOGIN_URL, requestOptions)
        let data = {}
        try {
            data = await response.json()
        } catch (error) {
            setError("Not able to login.")
        }

        if (response.ok) {
            auth.login(data?.username)
        } else {
            setShake(true)
            setTimeout(() => setShake(false), 500)
            if (response.status === 400) {
                setError(data.error || "Invalid username or password.")
            } else if (response.status === 500) {
                setError(data.error || "API Server is down")
            } else {
                setError(data.error || `Error ${response.status}`)
            }
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className={shake ? "animate-shake" : ""}>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Login or create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-800 border border-red-300">
                            <strong className="block font-semibold">Login Failed</strong>
                            <span>{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="Your username"
                                    required
                                    className={error ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    name="password"
                                    required
                                    className={error ? "border-red-500" : ""}
                                />
                            </div>
                            <Button type="submit" className="w-full hover:cursor-pointer">
                                Login
                            </Button>
                        </div>
                        <div className="text-center text-sm mt-4">
                            Don&apos;t have an account?{" "}
                            <a href="/signup" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
