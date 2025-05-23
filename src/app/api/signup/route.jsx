import { NextResponse } from "next/server";
import ApiProxy from "../proxy";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_REMINDERS_URL = `${DJANGO_API_ENDPOINT}/signup/`


//Register New User
export async function POST(request) {
    const requestData = await request.json()
    const { data, status } = await ApiProxy.post(DJANGO_API_REMINDERS_URL, requestData, false) // last boolean is for auth required or not which should be false since anyone should be able to signup
    return NextResponse.json(data, { status: status })
}

