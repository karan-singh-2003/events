// components/Skeletons/TaskSkeleton.tsx
import React from 'react';

const TaskSkeleton = () => {
  return (
    <div className="w-full p-4 border border-gray-700 bg-[#1c1c24] rounded-md animate-pulse mb-2">
      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
    </div>
  );
};

export default TaskSkeleton;
