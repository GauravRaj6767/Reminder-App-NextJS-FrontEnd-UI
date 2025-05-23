import { NextResponse } from "next/server";
import ApiProxy from "../../proxy";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const DJANGO_API_REMINDER_DETAIL_URL = `${DJANGO_API_ENDPOINT}/reminders/`

export async function PUT(request, { params }) {
    const id = params.id;
    const requestData = await request.json();
    const endpoint = `${DJANGO_API_REMINDER_DETAIL_URL}${id}/`
    const { data, status } = await ApiProxy.put(
        endpoint,
        requestData,
        true
    );
    return NextResponse.json(data, { status });
}

export async function GET(request, { params }) {
    const endpoint = params.id ? `${DJANGO_API_REMINDER_DETAIL_URL}${params.id}/` : null
    if (!endpoint) {
        return NextResponse.json({ id: params?.id }, { status: 400 });
    }
    const { data, status } = await ApiProxy.get(endpoint, true)
    return NextResponse.json(data, { status: status });
}

export async function DELETE(request, { params }) {
    const id = params.id;
    const endpoint = `${DJANGO_API_REMINDER_DETAIL_URL}${id}/delete/`
    console.log("ENDPOINT ---------- " + endpoint)
    const { data, status } = await ApiProxy.delete(endpoint, null, true);
    return NextResponse.json(data, { status });
}

