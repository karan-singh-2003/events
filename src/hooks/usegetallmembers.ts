
import { useParams } from "next/navigation";
import { useQueryData } from "./useQueryData";

export const usegetallmembers =()=>{
const {workspaceId} = useParams()

const {
  data: members = [],
  isPending,
  isFetching,
  refetch,
} = useQueryData(
  ['members', workspaceId],
  async () => {
    if (!workspaceId) return [];
    const res = await fetch(`/api/members/getallmembers?workspaceId=${workspaceId}`, {
      credentials: 'include',
    });
    const json:any = await res.json();
    return Array.isArray(json.members) ? json.members : [];
  },
  Boolean(workspaceId)
);

    return{
        members,
        isPending,
        isFetching,
        refetch

      }
}

