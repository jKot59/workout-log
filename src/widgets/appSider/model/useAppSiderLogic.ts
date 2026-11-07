import { startTransition, useLayoutEffect, useState } from 'react';
import { DayOfWeek } from './types';
import { arraysSymmetricDifference } from '@/shared/lib/helpers/arraysSymmetricDifference';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiFetch from '@/lib/apiFetch';
import { IProgram } from '@/shared/types/workout';

const initialDays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function useAppSiderLogic() {
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [isAvailableDaysListShown, setIsAvailableDaysListShown] = useState(false);
  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>(() => initialDays);

  const {
    data: programs = [],
    isLoading: isProgramsLoading,
    isSuccess,
  } = useQuery<IProgram[]>({
    queryKey: ['allPrograms'],
    queryFn: () => apiFetch('api/user-programs').then((res) => res.json()),
    retry: false,
  });

  const addProgram = useMutation({
    mutationFn: async (day: DayOfWeek) => {
      const response = await apiFetch('api/user-programs', {
        method: 'POST',
        body: JSON.stringify({ programName: day }),
      });

      if (!response.ok) throw new Error('Could not add program');
      return response.json();
    },

    onSuccess: (addedProgram) => {
      //TODO useOptimistic apply here
      queryClient.setQueryData<IProgram[]>(['allPrograms'], (current = []) => {
        if (current.some((program) => program.id === addedProgram.id)) return current;

        current.push(addedProgram);
        return current;
      });
    },
  });

  function toggleDaysList() {
    startTransition(() => setIsAvailableDaysListShown((prev) => !prev));
  }

  async function handleSelectDay(day: DayOfWeek) {
    addProgram.mutate(day, {
      onSuccess: () => {
        setAvailableDays((prev) => prev.filter((item) => item.toLowerCase() !== day.toLowerCase()));
        toggleDaysList();
      },
    });
  }

  useLayoutEffect(() => {
    if (!programs || !isSuccess) return;

    const loadProducts = () => {
      const takeOnlyDays = programs.map((program) => program.name.toLowerCase());
      setAvailableDays(() => arraysSymmetricDifference(initialDays, takeOnlyDays) as DayOfWeek[]);
    };

    loadProducts();
  }, [programs, isSuccess]);

  return {
    state: {
      programs,
      collapsed,
      availableDays,
      isProgramsLoading,
      isAvailableDaysListShown,
    },
    handlers: {
      setCollapsed,
      toggleDaysList,
      handleSelectDay,
    },
  };
}

export type TuseAppSiderLogic = ReturnType<typeof useAppSiderLogic>;
