"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// API endpoint
const REMINDER_API_URL = "/api/reminders/"

// Schema includes 'completed', but it's not shown in form
const reminderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    frequency: z.enum(["Daily", "Weekly", "Monthly"]),
    completed: z.boolean(),
})

export function CreateReminderForm({ className, ...props }) {
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            name: "",
            email: "",
            frequency: "Daily",
            completed: false,   // default false, not shown in form
        },
    })

    const { control, handleSubmit, reset } = form

    async function onSubmit(data) {
        try {
            const response = await fetch(REMINDER_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            const result = await response.json()
            if (response.ok) {
                setMessage("Reminder created successfully.")
                reset()
                router.replace('/reminders')
            } else {
                setError(result.error || "There was an error with your request.")
            }
        } catch (err) {
            setError("Network error. Please try again.")
        }
    }

    return (
        <div className="min-h-screen p-8 sm:p-20">
            <h1 className="text-2xl font-semibold mb-6">Create New Reminder</h1>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Reminder name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Frequency */}
                    <FormField
                        control={control}
                        name="frequency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Daily">Daily</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            className="hover:cursor-pointer"
                            onClick={() => {
                                reset()
                                router.replace('/reminders')
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="hover:cursor-pointer">Submit</Button>
                    </div>
                </form>
            </Form>

            {/* Feedback Messages */}
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    )
}


