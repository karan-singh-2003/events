'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { Separator } from '@/src/components/ui/separator';
import { cn } from '@/src/lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';

function Navigation() {
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
      label: 'My Tasks',
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
      label: 'Invite Peoples',
      href: `/workspace/${workspaceId}/invitemembers`,
      icon: '/setting1.svg',
    },
  ];

  return (
    <>
      <Tooltip.Provider delayDuration={150}>
        <ul className="flex flex-col items-center space-y-4 mt-4">
          {routes.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Tooltip.Root key={item.href}>
                <Tooltip.Trigger asChild>
                  <Link href={item.href}>
                    <div
                      className={cn(
                        'group  rounded-md transition-all',
                        isActive
                          ? 'text-blue-900'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                  </Link>
                </Tooltip.Trigger>

                <Tooltip.Content
                  side="right"
                  sideOffset={8}
                  className="z-50 rounded-md bg-white px-1.5 py-1.5 text-xs text-black shadow-md"
                >
                  {item.label}
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Root>
            );
          })}
        </ul>
      </Tooltip.Provider>

      <Separator className="my-4 bg-gray-300" />

      <div className="flex flex-col items-center space-y-4 my-3">
        <Image
          src="/searchicon.svg"
          alt="Search Icon"
          width={20}
          height={20}
          className="w-[20px] h-[20px]"
        />
      </div>
    </>
  );
}

export default Navigation;
