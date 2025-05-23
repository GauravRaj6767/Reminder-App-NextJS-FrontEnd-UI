import { NextResponse } from "next/server";
import ApiProxy from "../proxy";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_REMINDERS_URL = `${DJANGO_API_ENDPOINT}/reminders/`

//Get all reminders
export async function GET() {
    const { data, status } = await ApiProxy.get(DJANGO_API_REMINDERS_URL, true)
    return NextResponse.json(data, { status: status })
}


//Create new Reminder
export async function POST(request) {
    const requestData = await request.json()
    const { data, status } = await ApiProxy.post(DJANGO_API_REMINDERS_URL, requestData, true)
    return NextResponse.json(data, { status: status })
}

