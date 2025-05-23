"use client"

import { useEffect, useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const REMINDER_API_URL = "/api/reminders/"

const reminderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    frequency: z.enum(["Daily", "Weekly", "Monthly"]),
    completed: z.boolean(),
})

export function EditReminderForm({ data, lookupId }) {
    const router = useRouter()
    const [submitMessage, setSubmitMessage] = useState("")
    const [submitError, setSubmitError] = useState("")

    const form = useForm({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            name: data.name,
            email: data.email,
            frequency: data.frequency,
            completed: data.completed,
        },
    })

    const { control, handleSubmit } = form

    async function onSubmit(formData) {
        try {
            const response = await fetch(`${REMINDER_API_URL}${lookupId}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const result = await response.json()
            if (response.ok) {
                setSubmitMessage("Reminder updated successfully.")
                router.replace("/reminders")
            } else {
                setSubmitError(result.error || "Failed to update reminder.")
            }
        } catch (err) {
            setSubmitError("Network error. Please try again.")
        }
    }

    async function deleteReminder() {
        try {
            const response = await fetch(`${REMINDER_API_URL}${lookupId}/`,
                {
                    method: "DELETE",
                }
            )
            if (response.status === 204 || response.ok) {
                router.replace("/reminders");
                return;
            }

            const result = await response.json();
            setSubmitError(result.detail || "Failed to delete reminder.");

        } catch (error) {
            setSubmitError("Network error. Please try again." + error)
        }
    }

    return (
        <div className="min-h-screen p-8 sm:p-20">
            <h1 className="text-2xl font-semibold mb-6">Edit Reminder</h1>

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

                    <FormField
                        control={control}
                        name="completed"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="hover:cursor-pointer scale-150" />
                                </FormControl>
                                <FormLabel>Completed</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={async () => {
                                // Confirm first, if user wants to delete. If user says yes continue to delete else return to same page and flow does not go to await deleteReminder call
                                if (!confirm("Are you sure you want to delete this reminder?")) return;
                                await deleteReminder();
                                // router.replace("/reminders");
                            }}
                            className="hover:cursor-pointer"
                        >
                            Delete
                        </Button>
                        <Button variant="outline" onClick={() => router.replace("/reminders")} className="hover:cursor-pointer">Cancel</Button>
                        <Button type="submit" className="hover:cursor-pointer">Update</Button>
                    </div>
                </form>
            </Form>

            {submitMessage && <p className="mt-4 text-green-600">{submitMessage}</p>}
            {submitError && <p className="mt-4 text-red-600">{submitError}</p>}
        </div>
    )
}
