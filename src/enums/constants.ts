import { any } from "zod";

export const PermissionsForWorkspace = [
  // Workspace Permissions
 
  {
    id: 1,
    type: 'WORKSPACE',
    title: 'who can rename workspace',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
  {
    id: 2,
    type: 'WORKSPACE',
    title: 'who can send invite link to workspace',
    hasPermission: ['admin', 'manager', 'subadmin'],
  },
  {
    id: 3,
    type: 'WORKSPACE',
    title: 'who can approve invite members to workspace',
    hasPermission: ['admin', 'moderator', 'media admin', 'data entry', 'team member'],
  },
  {
    id: 4,
    type: 'WORKSPACE',
    title: 'who can remove members from workspace',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },
  {
    id: 5,
    type: 'WORKSPACE',
    title: 'who can delete workspace',
    hasPermission: ['admin', 'moderator', 'events admin'],
  },

  // Event Permissions
  {
    id: 6,
    type: 'EVENT',
    title: 'who can create/edit/delete events',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
  {
    id: 7,
    type: 'EVENT',
    title: 'who can approve/reject event proposals',
    hasPermission: ['admin', 'moderator', 'media admin', 'data entry', 'team member'],
  },
  {
    id: 8,
    type: 'EVENT',
    title: 'who can view event analytics',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },

  // Task Permissions
  {
    id: 9,
    type: 'TASK',
    title: 'who can create/assign tasks',
    hasPermission: ['admin', 'moderator', 'media admin', 'data entry', 'team member'],
  },
  {
    id: 10,
    type: 'TASK',
    title: 'Who can mark tasks as done',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },
  {
    id: 11,
    type: 'TASK',
    title: 'who can edit/delete tasks',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
]
