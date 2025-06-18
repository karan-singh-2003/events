'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { createEventSchema, CreateEventInput } from '../schemas/createEventSchema';

const useCreateEvent = (workspaceId: any) => {
    const queryClient = useQueryClient();

  const [serverError, setServerError] = useState<string | null>(null);
 
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    mode: 'onChange',
  });

  const {
    mutate,
    isPending,
    isSuccess,
    data,
  } = useMutation({
    mutationKey: ['CreateEvent'],
    mutationFn: async (formData: CreateEventInput) => {
      const payload = { ...formData, workspaceId };
      const response = await axios.post('/api/events/createevents', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      reset();
      queryClient.invalidateQueries({ queryKey: ['events', workspaceId] }); 
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
  };
};

export default useCreateEvent;
