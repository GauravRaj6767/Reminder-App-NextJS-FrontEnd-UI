"use client"

import { use } from "react"
import { useAuth } from "@/components/authProvider";
import React, { useEffect } from "react";
import { EditReminderForm } from "@/components/editReminderForm"


import useSWR from "swr";


const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = new Error("Failed to fetch reminder.");
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};

export default function Page({ params }) {
    const unwrappedParams = use(params)
    const lookupId = unwrappedParams ? unwrappedParams.id : 0
    const endpoint = `/api/reminders/${lookupId}`

    const { data, error, isLoading } = useSWR(endpoint, fetcher)

    const auth = useAuth()
    useEffect(() => {
        if (error?.status === 401) {
            auth.loginRequiredRedirect();
        }
    }, [auth, error]);

    if (error) {
        if (error.status === 404) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-red-100 text-red-700 border border-red-400 px-6 py-4 rounded-md shadow-md animate-fade-in">
                        <p className="font-semibold text-lg">Oops! Failed to find reminder or API server is down.</p>
                        <p className="text-sm mt-1">Please check your reminder id or try again !.</p>
                    </div>
                </div>
            )
        }
        else if (error.status === 401) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="bg-red-100 text-red-700 border border-red-400 px-6 py-4 rounded-md shadow-md animate-fade-in">
                        <p className="font-semibold text-lg">Oops! Need to LOGIN to view reminders.</p>
                        <p className="text-sm mt-1">Please check your reminder id or try again !.</p>
                    </div>
                </div>
            )
        }
    }


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div>
            <EditReminderForm data={data} lookupId={lookupId} />
        </div>
    )
}
