'use client'
import { useQueryData } from "./useQueryData";
import { useTaskfilter } from "./useTaskfilter";

export const usegetallTasks = ({ workspaceId, eventId }: any) => {
  const [{ status, assigneId, projectId, dueDate }] = useTaskfilter();

  const queryParams = new URLSearchParams();
  if (workspaceId) queryParams.append('workspaceId', workspaceId);
  if (eventId) queryParams.append('eventId', eventId);
  if (status) queryParams.append('status', status);
  if (assigneId) queryParams.append('assigneId', assigneId);
  if (projectId) queryParams.append('projectId', projectId);
  if (dueDate) queryParams.append('dueDate', dueDate);

  const {
    data: tasks = [],
    isPending,
    isFetching,
    refetch,
  } = useQueryData(
    ['tasks', eventId, status, assigneId, projectId, dueDate],
    async () => {
      const res = await fetch(`/api/task/gettalltaskbyeventId?${queryParams.toString()}`, {
        credentials: 'include',
      });
      const json: any = await res.json();
      return Array.isArray(json.tasks) ? json.tasks : [];
    },
    Boolean(workspaceId && eventId)
  );

  return {
    tasks,
    isPending,
    isFetching,
    refetch,
  };
};


// import { useQueryData } from "./useQueryData";

// export const usegetallTasks =({ workspaceId, eventId}:any)=>{
// const {
//         data: tasks = [],
//         isPending,
//         isFetching,
//         refetch,
//       } = useQueryData(
//         ['tasks',eventId],
//         async () => {
//           if (!workspaceId) return [];
//           const res = await fetch(`/api/task/gettalltaskbyeventId?workspaceId=${workspaceId}&eventId=${eventId}`, {
//             credentials: 'include',
//           });
//           const json: any = await res.json();
//           return Array.isArray(json.tasks) ? json.tasks : [];
//         },
//         Boolean(workspaceId)
//       );
    
//       return{
//         tasks,
//         isPending,
//         isFetching,
//         refetch

//       }
// }