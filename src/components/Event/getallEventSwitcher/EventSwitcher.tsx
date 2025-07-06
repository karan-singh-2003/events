'use client';

import React, { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation';
import Spinner from '@/src/components/global/Spinner';
import { useQueryData } from '@/src/hooks/useQueryData';

// ✅ Radix Tooltip import
import * as Tooltip from '@radix-ui/react-tooltip';

export default function EventSwitcher() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const eventId = params?.eventId as string | undefined;

  const {
    data: events = [],
    isPending,
    isFetching,
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
        <Spinner color="#2C2C2C" size={14} />
      </div>
    );
  }

  return (
    <Tooltip.Provider>
      <Select onValueChange={onSelect} value={selectedEvent?.id}>
        <Tooltip.Root delayDuration={200}>
          <Tooltip.Trigger asChild>
            <SelectTrigger className="w-[32px] font-medium p-2 text-gray-900 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <div className="flex items-center gap-3">
                {selectedEvent ? (
                  <div className="flex relative right-1 items-center justify-center h-[22px] w-[25px] rounded-full bg-indigo-500 text-white font-semibold">
                    {selectedEvent.name?.[0]?.toUpperCase()}
                  </div>
                ) : (
                  <div className="flex relative right-1 items-center justify-center w-[24px] h-[28px] rounded-full">
                    📅
                  </div>
                )}
              </div>
            </SelectTrigger>
          </Tooltip.Trigger>

          {/* Tooltip content */}
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="z-50 rounded-md bg-black px-3 py-1.5 text-xs text-white shadow-md"
          >
            {selectedEvent?.name || 'Select event'}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Root>

        <SelectContent className="bg-white shadow-md border border-gray-200 rounded-md">
          {events.map((event: any) => (
            <SelectItem
              key={event.id}
              value={event.id}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md transition"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white font-semibold">
                {event.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-900 font-medium">{event.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Tooltip.Provider>
  );
}
