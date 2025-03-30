import React from 'react'
import clsx from 'clsx'
import { getColorForString } from '@/src/utils/getColor'
import { Button } from '@/src/components/ui/button'
import { useRouter } from 'next/navigation'
interface WorkspaceCardProps {
  workspaceName: string
  members?: number
  className?: string
  url: string
  isOnboarding?: boolean
}

const WorkspaceCard = ({
  workspaceName,
  members,
  className,
  url,
  isOnboarding,
}: WorkspaceCardProps) => {
  const router = useRouter()
  const bgColor = getColorForString(workspaceName)
  const handleRedirectToWorkspace = () => {
    if (!isOnboarding) {
      router.push(`/${url}/roles-permissions`)
    } else {
      router.push(`/o/${url}`)
    }
  }
  return (
    <div className="flex items-center justify-between mt-1.5 py-3 px-4 bg-transparent rounded-none hover:bg-[#292929] transition-all duration-200">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div
            className={clsx(
              'w-10 h-10 rounded-full flex font-bold items-center justify-center text-lg text-white shadow-md',
              className
            )}
            style={{ backgroundColor: bgColor }}
          >
            {workspaceName.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 ml-4">
            <h3 className="text-lg text-white font-medium">{workspaceName}</h3>
            {members !== undefined && members !== null && (
              <div className="text-xs bg-[#214C00] text-[#6FFF00] py-0.5 px-3 my-0.5 rounded-full items-center justify-center flex w-fit">
                <span className="mr-1 -mt-1 text-base">•</span>
                <div className="text-center text-xs">{members} members</div>
              </div>
            )}
          </div>
        </div>

        <Button
          className="bg-[#2F00FF]/20 text-[#456AFF] rounded-none font-medium text-xs px-5 py-2 hover:bg-[#2F00FF]/30 transition-all duration-200"
          onClick={handleRedirectToWorkspace}
        >
          Launch
        </Button>
      </div>
    </div>
  )
}

export default WorkspaceCard
