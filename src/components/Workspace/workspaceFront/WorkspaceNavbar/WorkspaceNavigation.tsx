'use client'

import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';
import { SettingsIcon, UserIcon } from 'lucide-react';
import { MdEmail } from 'react-icons/md';
import React from 'react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';
import { useParams, usePathname } from 'next/navigation';
import { Separator } from '@/src/components/ui/separator';
import EventModalTriggerButton from '../../EventModalTriggerButton/Index';

function Navigation() {
  const { workspaceId } = useParams();
  const pathname = usePathname();

  if (!workspaceId) return null;

  const routes = [
    {
      label: 'Home',
      href: '/',
      icon: GoHome,
      activeIcon: GoHomeFill
    },
    {
      label: 'My Tasks',
      href: '/tasks',
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill
    },
    {
      label: 'Settings',
      href: `/workspace/${workspaceId}/workspacesetting`,
      icon: SettingsIcon,
      activeIcon: SettingsIcon
    },
    {
      label: 'Members',
      href: '/members',
      icon: UserIcon,
      activeIcon: UserIcon
    },
    {
      label: 'Invite Peoples',
      href: `/workspace/${workspaceId}/invitemembers`,
      icon: MdEmail,
      activeIcon: MdEmail
    }
  ];

  return (
    <>
      <ul className="flex flex-col items-center space-y-4 mt-4">
        {routes.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'group p-2 rounded-md transition-all',
                  isActive ? 'bg-gray-200 text-black shadow' : 'hover:bg-gray-100'
                )}
                title={item.label} // Tooltip on hover
              >
                <Icon className="size-6 text-gray-500" />
              </div>
            </Link>
          );
        })}
      </ul>

      <Separator className="my-4 bg-gray-300" />

      {/* <div className="flex justify-center">
        <EventModalTriggerButton />
      </div> */}
    </>
  );
}

export default Navigation;
