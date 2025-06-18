'use client';

import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import Modal from '../../global/CustomModal';
import useCreateEvent from '@/src/hooks/useCreateEvents';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

// const statusOptions = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
// const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, workspaceId }) => {
  const {
    register,
    onFormSubmit,
    errors,
    isPending,
  } = useCreateEvent(workspaceId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} height="auto" width="600px" className="rounded-none text-black max-w-[90vw]">
      <div className="flex flex-col h-full justify-between px-4 py-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center text-white text-lg font-semibold">Create Event</div>

        <form onSubmit={onFormSubmit} className="flex flex-col gap-5 mt-6">
          {/* Event Name */}
          <div className="flex flex-col">
            <label className="text-white mb-1 text-sm font-medium">Event Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Event Title"
              className="bg-[#383838] text-white px-4 py-3 rounded-md border border-[#444] outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
              disabled={isPending}
              className={cn(
                "bg-[#635BFF] hover:bg-[#635BFF]/80 text-white py-2.5 w-full sm:w-auto h-[50px] rounded-md text-base",
                isPending && "opacity-50 cursor-not-allowed"

              )}
            >
              {isPending ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EventModal;
