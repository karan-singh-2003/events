'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useParams } from 'next/navigation';
import Spinner from '@/src/components/global/Spinner';
import { useQueryData } from '@/src/hooks/useQueryData';

function EventSwitcher() {
  const { workspaceId, eventId } = useParams();
  const router = useRouter();

  const {
    data: events = [],
    isPending,
    isFetching,
  } = useQueryData(
    ['events', workspaceId],
    async () => {
      const res = await fetch(`/api/events/getallevents?workspaceId=${workspaceId}`);
      const json = await res.json();

      // ✅ Fix: correctly extract data from JSON response
      const data = json?.data;
      return Array.isArray(data) ? data : [];
    },
    true // enabled flag
  );

  const onSelect = (id: string) => {
    router.push(`/workspace/${workspaceId}/events/${id}`);
  };

  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-[50px]">
        <Spinner color="#FFFFFF" size={14} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Select onValueChange={onSelect} value={eventId as string}>
        <SelectTrigger className="w-full font-medium p-2 text-gray-100 bg-[#2C2C2C] border border-[#3a3a3a] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <SelectValue placeholder="Select an event" className="text-gray-300" />
        </SelectTrigger>

        <SelectContent
          className="bg-[#2C2C2C] text-gray-200 border border-[#3a3a3a] max-h-60 overflow-y-auto"
        >
          {events.map((event: any) => (
            <SelectItem
              key={event.id}
              value={event.id}
              className="hover:bg-indigo-500/20 hover:text-indigo-300 cursor-pointer transition-colors duration-150 rounded-md"
            >
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default EventSwitcher;
