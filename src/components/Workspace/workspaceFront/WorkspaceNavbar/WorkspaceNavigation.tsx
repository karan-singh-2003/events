'use client'

import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';
import { SettingsIcon, UserIcon } from 'lucide-react';
import { MdEmail } from 'react-icons/md';
import React from 'react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';
import { useParams } from 'next/navigation';
import { Separator } from '@/src/components/ui/separator';
import EventModalTriggerButton from '../../EventModalTriggerButton/Index';

function Navigation() {
  const { workspaceId } = useParams();

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

  return (<>
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = false; // TODO: Add logic using `usePathname` if needed
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                'group flex items-center gap-2.5 p-2 rounded-md font-medium transition text-white/70',
                isActive
                ? 'bg-white text-primary shadow-sm hover:opacity-100'
                : 'hover:bg-black hover:text-white '
              )}
              >
              <Icon className="size-5 group-hover:text-white" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
    <Separator className='m-2 bg-[#505152]'/>
    <div className='flex  justify-between'>
    <div className='flex text-sm uppercase text-white/70 tracking-wider  '>
      Event
    </div>
    <div><EventModalTriggerButton/></div>

    </div>
      </>
  );
}

export default Navigation;
 