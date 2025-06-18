// src/hooks/useTaskUpdateMutation.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useTaskUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, position }: { id: string; status: string; position: number }) => {
      const res = await fetch(`/api/task/kanbanupdate/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, position }),
      });

      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    onSuccess: () => {
      // 👇 this will re-fetch your usegetallTasks query
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
