'use client'

import React from 'react'
import WorkspaceNavbar from '@/src/components/Workspace/workspaceFront/WorkspaceNavbar/WorkspaceNavbar'
import WorkspaceSlider from '@/src/components/Workspace/workspaceFront/WorkspaceSlider'
import { NuqsAdapter } from 'nuqs/adapters/next'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels'
import BottomNavigation from '@/src/components/Workspace/workspaceFront/WorkspaceNavbar/BottomNavigation'

interface DashboardlayoutProps {
  children: React.ReactNode
}

function Layout({ children }: DashboardlayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Top Navbar */}
      <div className="fixed top-0 left-0 z-50 w-full h-[49px] bg-white border-b border-gray-200">
        <WorkspaceNavbar />
      </div>

      {/* Content Area */}
      <div className="pt-[49px] h-[calc(100vh)] ">
        <PanelGroup direction="horizontal" className="h-full  ">
          {/* Sidebar Panel */}
          <Panel defaultSize={10} minSize={8} maxSize={18} className='bg-[#f0f0f0] hidden lg:block '>
            <div className="hidden lg:block fixed top-[49px] left-0 h-[calc(100vh-49px)] w-full max-w-[44px] border-r border-gray-200 bg-white z-40">
              <WorkspaceSlider />
            </div>
          </Panel>
      <BottomNavigation/>
          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-[#f6f6f6]  cursor-col-resize " />

          {/* Main Content Panel */}
          <Panel>
  <div className="lg:pl-[11px] h-full">
    <div className="mx-auto max-w-screen-2xl h-full">
      <main className="h-full overflow-y-auto px-3 sm:px-6 py-4">
        <NuqsAdapter>{children}</NuqsAdapter>
      </main>
    </div>
  </div>
</Panel>

        </PanelGroup>
      </div>
    </div>
  )
}

export default Layout
