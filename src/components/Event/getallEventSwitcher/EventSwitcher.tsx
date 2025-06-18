'use client';

import React, { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation';
import Spinner from '@/src/components/global/Spinner';
import { useQueryData } from '@/src/hooks/useQueryData';

interface EventSwitcherProps {
  workspaceId: string;
}

export default function EventSwitcher() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params?.workspaceId as any 
  const eventId = params?.eventId as any | undefined;

  const {
  data: events = [],
  isPending,
  isFetching,
  refetch,
} = useQueryData(
  ['events', workspaceId],
  async () => {
    if (!workspaceId) return [];
    const res = await fetch(`/api/events/getallevents?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  },
  Boolean(workspaceId)
 
);

  const selectedEvent = events.find((e: any) => e.id === eventId);

  useEffect(() => {
    if (eventId && !selectedEvent) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [eventId, selectedEvent, workspaceId, router]);

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
    <Select onValueChange={onSelect} value={selectedEvent?.id}>
    <SelectTrigger className="w-full font-medium p-2 text-gray-100 bg-[#2C2C2C] border border-[#3a3a3a] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <SelectValue placeholder="Select event" />
      </SelectTrigger>
      <SelectContent>
        {events.map((event: any) => (
          <SelectItem key={event.id} value={event.id}>
            {event.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
