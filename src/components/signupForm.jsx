"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const SIGNUP_API_URL = "/api/signup/"

const signupSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function SignupForm() {
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    const { control, handleSubmit, reset } = form

    async function onSubmit(data) {
        try {
            const response = await fetch(SIGNUP_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (response.ok) {
                console.log("SIGNUP DONE")
                setMessage("Signup successful.")
                reset()
                router.replace("/login")
            }
        } catch (err) {
            setError("Network error. Please try again.")
        }
    }

    return (
        <div className="min-h-screen p-8 sm:p-20">
            <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="your_username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                reset()
                                router.replace("/")
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="hover:cursor-pointer">Sign Up</Button>
                    </div>
                </form>
            </Form>

            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    )
}
