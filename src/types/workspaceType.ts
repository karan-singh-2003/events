export interface Workspace {
  workspaceId: string
  workspaceName: string
  membersCount: number
  members: {
    id: string
    name: string
    email: string
    isAdmin: boolean
  }[]
}
