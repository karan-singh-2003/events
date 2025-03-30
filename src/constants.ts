export const PermissionsForWorkspace = [
  {
    id: 1,
    title: 'who can rename workspace',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
  {
    id: 2,
    title: 'who can send invite link to  workspace',
    hasPermission: ['admin', 'manager', 'subadmin'],
  },
  {
    id: 3,
    title: 'who can approve invite members to  workspace',
    hasPermission: [
      'admin',
      'moderator',
      'media admin',
      'data entry',
      'team member',
    ],
  },
  {
    id: 4,
    title: 'who can remove  members from workspace',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },
  {
    id: 5,
    title: 'who can delete  workspace',
    hasPermission: ['admin', 'moderator', 'events admin'],
  },
]

export const EventPermissions = [
  {
    id: 1,
    title: 'who can create/edit/delete events',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
  {
    id: 2,
    title: 'who can approve/reject event proposals',
    hasPermission: [
      'admin',
      'moderator',
      'media admin',
      'data entry',
      'team member',
    ],
  },
  {
    id: 3,
    title: 'who can view event analytics',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },
]

export const TaskPermissions = [
  {
    id: 1,
    title: 'who can create/assign tasks',
    hasPermission: [
      'admin',
      'moderator',
      'media admin',
      'data entry',
      'team member',
    ],
  },
  ,
  {
    id: 2,
    title: 'Who can mark tasks as done',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },
  {
    id: 3,
    title: 'who can edit/delete tasks',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
]
