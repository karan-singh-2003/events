

import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import Modal from '../../global/CustomModal';
import useCreateTask from '@/src/hooks/useCreatetask';
import { useQueryData } from '@/src/hooks/useQueryData';

interface TaskProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: any;
  workspaceId:any
}

const statusOptions = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

const TaskModal: React.FC<TaskProps> = ({ isOpen, onClose, eventId,workspaceId }) => {

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

const {
     register,
     onFormSubmit,
     errors,
     isPending:taskpending,
     deadline,
     setDeadline,
   } = useCreateTask(eventId, workspaceId);
 
  return (
   <Modal isOpen={isOpen} onClose={onClose} height="auto" width="600px" className="rounded-none text-black max-w-[90vw]">
        <div className="flex flex-col h-full justify-between px-4 py-6 max-h-[90vh] overflow-y-auto">
          <div className="text-center text-white text-lg font-semibold">Create Task</div>
  
          <form onSubmit={onFormSubmit} className="flex flex-col gap-5 mt-6">
            {/* Event Name */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Task Name</label>
              <input
                {...register('title')}
                type="text"
                placeholder="Event Title"
                className="bg-[#383838] text-white px-4 py-3 rounded-md border border-[#444] outline-none"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
  
            {/* Description */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Description</label>
              <textarea
                {...register('description')}
                placeholder="Enter event details"
                rows={3}
                className="bg-[#383838] text-white px-4 py-3 rounded-md border border-[#444] outline-none resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
  
            {/* Status */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Status</label>
              <select
                {...register('status')}
                className="bg-[#383838] text-white px-4 py-3 border border-[#444] rounded-md outline-none"
              >
                <option value="">-- Select Status --</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
  
            {/* Priority */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Priority</label>
              <select
                {...register('priority')}
                className="bg-[#383838] text-white px-4 py-3 border border-[#444] rounded-md outline-none"
              >
                <option value="">-- Select Priority --</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
            </div>

            {/* Assign to Member */}
<div className="flex flex-col">
  <label className="text-white mb-1 text-sm font-medium">Assign To</label>
  <select
    {...register('assigningMemberId')}
    className="bg-[#383838] text-white px-4 py-3 border border-[#444] rounded-md outline-none"
  >
    <option value="">-- Select Member --</option>
    {members.map((member:any) => (
      <option key={member.id} value={member.id}>
        {member.user.name} ({member.Roles.name}) 
      </option>
    ))}
  </select>
  {errors.assigningMemberId && <p className="text-red-500 text-sm">{errors.assigningMemberId.message}</p>}
</div>

  
            {/* Deadline Picker */}
            <div className="flex flex-col">
              <label className="text-white mb-1 text-sm font-medium">Deadline</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'w-full flex items-center justify-start gap-2 px-4 py-3 rounded-md border border-[#444] bg-[#383838] text-white',
                      !deadline && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {deadline ? format(deadline, 'PPP') : <span>Pick a date</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {!deadline && <p className="text-red-500 text-sm mt-1">Deadline is required</p>}
            </div>
  
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
              
                className="bg-[#383838] hover:bg-[#333] text-white py-2.5 w-full sm:w-auto h-[50px] rounded-md text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={taskpending}
                className={cn(
                  "bg-[#635BFF] hover:bg-[#635BFF]/80 text-white py-2.5 w-full sm:w-auto h-[50px] rounded-md text-base",
                  taskpending && "opacity-50 cursor-not-allowed"
  
                )}
              >
                {taskpending ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
     
  );
};

export default TaskModal;
