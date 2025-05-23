export const DJANGO_PORT = process.env.DJANGO_PORT ? process.env.DJANGO_PORT : "8001"

export const DJANGO_API_BASE_URL = process.env.DJANGO_API_BASE_URL ? process.env.DJANGO_API_BASE_URL : `http://127.0.0.1:${DJANGO_PORT}`

export const DJANGO_API_ENDPOINT = `${DJANGO_API_BASE_URL}/api`


