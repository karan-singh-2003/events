'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import EventSwitcher from '@/src/components/Event/getallEventSwitcher/EventSwitcher';

function BottomNavigation() {
  const { workspaceId } = useParams();
  const pathname = usePathname();

  if (!workspaceId) return null;

  const routes = [
    {
      label: 'Home',
      href: '/',
      icon: '/home.svg',
    },
    {
      label: 'Tasks',
      href: '/tasks',
      icon: '/calender.svg',
    },
    {
      label: 'Settings',
      href: `/workspace/${workspaceId}/workspacesetting`,
      icon: '/setting1.svg',
    },
    {
      label: 'Notification',
      href: '/notification',
      icon: '/notification.svg',
    },
    {
      label: 'Members',
      href: '/members',
      icon: '/members.svg',
    },
    {
      label: 'Invite',
      href: `/workspace/${workspaceId}/invitemembers`,
      icon: '/setting1.svg',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 lg:hidden">
      <div className="flex overflow-x-auto no-scrollbar px-5 py-5 gap-x-6">
        {routes.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-[70px] text-xs p-8 rounded-md transition-all duration-150',
                isActive ? 'bg-gray-100 text-blue-900' : 'hover:bg-gray-100'
              )}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={50}
                height={50}
                className={cn(
                  'w-[30px] h-[30px] mb-1',
                  isActive ? 'opacity-100' : 'opacity-70'
                )}
              />
              <span
                className={cn(
                  'text-[13px] font-semibold',
                  isActive ? 'text-blue-900' : 'text-gray-600'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Optional: EventSwitcher stays at end */}
        <div className="flex items-center justify-center min-w-[70px]">
          <EventSwitcher />
        </div>
      </div>
    </div>
  );
}

export default BottomNavigation;
