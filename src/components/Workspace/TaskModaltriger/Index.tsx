'use client';

import React, { useState } from 'react';
import TaskModal from '../AddTaskModal/Index';
import { useParams } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';

const   TaskModalTriggerButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { eventId } = useParams();
  const {workspaceId} = useParams()
  return (
    <>
      <span
        onClick={openModal}
        className="cursor-pointer inline-flex"
        role="button"
        tabIndex={0}
      >
        <RiAddCircleFill
          className="text-indigo-400 hover:text-indigo-500 size-5 transition-colors duration-200"
        />
      </span>

      <TaskModal isOpen={isModalOpen} onClose={closeModal} eventId={eventId} workspaceId={workspaceId} />
    </>
  );
};

export default TaskModalTriggerButton;
