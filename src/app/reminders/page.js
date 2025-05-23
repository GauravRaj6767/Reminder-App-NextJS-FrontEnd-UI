"use client"

import { useAuth } from "@/components/authProvider";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { useRouter } from "next/navigation";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

const REMINDER_API_URL = "/api/reminders/";

export default function Page() {
  const { data, error, isLoading } = useSWR(REMINDER_API_URL, fetcher);
  const auth = useAuth();
  const router = useRouter()
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (error?.status === 401) {
      auth.loginRequiredRedirect();
    }
  }, [auth, error]);

  useEffect(() => {
    if (data) {
      setReminders(Object.values(data));
    }
  }, [data]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }


  const handleCreate = () => {
    router.push("/reminders/new")
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6">Your Reminders</h1>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Edit/Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.map((reminder, index) => (
                <TableRow
                  key={reminder.id}
                  className={reminder.completed ? 'line-through opacity-60' : ''}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{reminder.name}</TableCell>
                  <TableCell>{reminder.email}</TableCell>
                  <TableCell>{reminder.frequency}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={reminder.completed}
                    />
                  </TableCell>
                  <TableCell className="hover:cursor-pointer" onClick={e => router.push(`/reminders/${reminder.id}`)}>Click</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCreate} className="hover:cursor-pointer">
            Create New
          </Button>
        </div>
      </main>
    </div>
  );
}
