import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go'
import React from 'react'
import { SettingsIcon, UserIcon } from 'lucide-react'

import { MdEmail } from 'react-icons/md';

import Link from 'next/link'
import { cn } from '@/src/lib/utils'
import { useParams } from 'next/navigation';
function Navigation() {
  const { workspaceId } = useParams()

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
    href: '/settings',
    icon: SettingsIcon,
    activeIcon: SettingsIcon
  },
  {
    label: 'Members',
    href: '/members',
    icon: UserIcon,
    activeIcon: UserIcon
  }
  ,
  {
    label: 'Invite Peoples',
    href: `/workspace/${workspaceId}/invitemembers`,
    icon: MdEmail,
    activeIcon: MdEmail
  }
]


  return (
    <>
      <ul className="flex flex-col">
        {routes.map((item) => {
          const isActive = false; // Update this logic with actual routing logic if needed
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
    </>
  );
}

export default Navigation;
