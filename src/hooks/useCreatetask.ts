'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { createTaskSchema, CreateTaskInput } from '../schemas/createTaskschema';

const useCreateTask = (eventId: string, workspaceId: string) => {
  const queryClient = useQueryClient();
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onChange',
  });

  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationKey: ['CreateTask'],
    mutationFn: async (formData: CreateTaskInput) => {
      if (!deadline) throw new Error('Deadline is required');

      const payload = {
        ...formData,
        deadline,
        eventId,
        workspaceId,
      };

      const response = await axios.post('/api/task/createtask', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Task created successfully!');
      reset();
      setDeadline(undefined);
      queryClient.invalidateQueries({ queryKey: ['tasks',  eventId] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';
      setServerError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    },
  });

  const onFormSubmit = handleSubmit((formData) => {
    mutate(formData);
  });

  return {
    register,
    errors,
    isValid,
    onFormSubmit,
    isPending,
    isSuccess,
    serverError,
    data,
    deadline,
    setDeadline,
  };
};

export default useCreateTask;
