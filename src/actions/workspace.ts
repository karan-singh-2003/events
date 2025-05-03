'use server'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'
import { cookies } from 'next/headers'

import { defaultRoles } from '../enums/constantRoles'
import { PermissionsForWorkspace } from '../enums/constants'
import { any } from 'zod'
import { PermissionType } from '@prisma/client'

export async function getUserAllWorkspaces() {
  const cookieStore = cookies();
  const sessionId = (await cookieStore).get('session_id')?.value;

  if (!sessionId) {
    return { error: 'Unauthorized - No session ID', status: 401 };
  }

  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) {
    return { error: 'Unauthorized - No session data', status: 401 };
  }

  const user = JSON.parse(sessionData);
  if (!user?.id) {
    return { error: 'Unauthorized - Invalid user data', status: 401 };
  }

  // Find all workspaces the user is a member of
  const userMemberships = await prisma.members.findMany({
    where: {
      userId: user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  const workspaceIds = userMemberships.map(m => m.workspaceId);

  if (workspaceIds.length === 0) {
    return { data: [], status: 200 };
  }

  // Get workspace names and member counts
  const workspacesWithCounts = await Promise.all(
    workspaceIds.map(async (id) => {
      const workspace = await prisma.workspaces.findUnique({
        where: { id },
        select: {
          name: true,
        },
      });

      const memberCount = await prisma.members.count({
        where: {
          workspaceId: id,
        },
      });

      return {
        workspaceId: id,
        workspaceName: workspace?.name,
        memberCount,
      };
    })
  );

  return { data: workspacesWithCounts, status: 200 };
}


export async function renameWorkspace({
  name,
  workspaceId,
  
}: {
  name: string
  workspaceId: string
  
}) {

  const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

  if (!sessionId) {
    return { error: 'Unauthorized - No session ID', status: 401 }
  }

  const sessionData = await redis.get(`session:${sessionId}`)
  if (!sessionData) {
    return { error: 'Unauthorized - No session data', status: 401 }
  }

  const user = JSON.parse(sessionData)
  if (!user?.id) {
    return { error: 'Unauthorized - Invalid user data', status: 401 }
  }

  if (!name || !workspaceId) {
    return { error: 'Missing name or workspace ID', status: 400 }
  }

  const member = await prisma.members.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
    include: {
      Roles: true,
    },
  })

  if (!member || !member.Roles) {
    return { error: 'You are not a member of this workspace', status: 403 }
  }

  const permission = await prisma.permission.findFirst({
    where: {
      title: 'who can rename workspace',
      workspaceId,
    },
  })

  if (!permission) {
    return { error: 'Rename permission not found', status: 403 }
  }

  const hasPermission = await prisma.rolePermission.findFirst({
    where: {
      roleId: member.Roles.id,
      permissionId: permission.id,
      workspaceId,
    },
  })

  if (!hasPermission) {
    return { error: 'You do not have permission to rename this workspace', status: 403 }
  }

  const updatedWorkspace = await prisma.workspaces.update({
    where: {
      id: workspaceId,
    },
    data: {
      name,
    },
  })

  return { workspace: updatedWorkspace }
}

export async function getWorkspaceById({
  workspaceId
}: {
  workspaceId: any;
}) {
  const cookieStore = cookies();
  const sessionId = (await cookieStore).get('session_id')?.value;

  if (!sessionId) {
    return { error: 'Unauthorized - No session ID', status: 401 };
  }

  const sessionData = await redis.get(`session:${sessionId}`);
  if (!sessionData) {
    return { error: 'Unauthorized - No session data', status: 401 };
  }

  const user = JSON.parse(sessionData);
  if (!user?.id) {
    return { error: 'Unauthorized - Invalid user data', status: 401 };
  }

  if (!workspaceId) {
    return { error: 'Missing workspace ID', status: 400 };
  }

  const member = await prisma.members.findFirst({
    where: {
      userId: user.id,
      workspaceId,
    },
  });

  if (!member) {
    return {
      error: 'You are not a member of this workspace',
      status: 403,
    };
  }

  const workspace = await prisma.workspaces.findUnique({
    where: { id: workspaceId }
  });

  if (!workspace) {
    return { error: 'Workspace not found', status: 404 };
  }

  return { workspace };
}
