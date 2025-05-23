"use client"

import { useAuth } from "@/components/authProvider";
import { ThemeToggleButton } from "@/components/themeToggleButton";
import useSWR from "swr";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

console.log("TEST ENDPOINT 1 -----   " + DJANGO_API_ENDPOINT)
const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Home() {
  const auth = useAuth();
  const router = useRouter()
  console.log("TEST ENDPOINT in -----   " + DJANGO_API_ENDPOINT)


  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-800">
      <header className="w-full flex justify-end">
        <ThemeToggleButton />
      </header>

      <main className="flex flex-col gap-6 items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 dark:text-white">Welcome to MedMind</h1>
        <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 max-w-xl">
          Your personal medicine reminder app. Stay on track with your health by never missing a dose again.
        </p>
        <div className="mt-4 text-xl font-medium text-blue-900 dark:text-zinc-100">
          {auth.isAuthenticated ? `Hello, ${auth.username ? auth.username : "User"}! 👋` : "Hello Guest! Please log in to manage your reminders."}
        </div>
        <Button onClick={e => router.push('/reminders/new')} className="hover:cursor-pointer">
          Create a New Reminder
        </Button>
      </main>

    </div>
  );
}
