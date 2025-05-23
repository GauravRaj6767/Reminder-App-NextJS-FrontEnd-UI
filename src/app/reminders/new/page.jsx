"use client"

import { CreateReminderForm } from "@/components/createReminderForm"
import { useAuth } from "@/components/authProvider";
import { useEffect } from "react";

import useSWR from "swr";

const REMINDER_API_URL = "/api/reminders/";

const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};


export default function NewReminderPage() {

    const { data, error, isLoading } = useSWR(REMINDER_API_URL, fetcher)
    const auth = useAuth()

    // To check if user is logged in 
    // start

    useEffect(() => {
        if (error?.status === 401) {
            auth.loginRequiredRedirect();
        }
    }, [auth, error]);

    // end

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        if (error.status === 401) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            )
        }
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-red-100 text-red-700 border border-red-400 px-6 py-4 rounded-md shadow-md animate-fade-in">
                    <p className="font-semibold text-lg">Oops! Failed to load reminder.</p>
                    <p className="text-sm mt-1">Please check your connection or try again later.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <CreateReminderForm />
        </div>
    )
}
