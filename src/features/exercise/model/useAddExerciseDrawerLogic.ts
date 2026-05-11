import { useIndexedDBSyncWithZustand } from '@/shared/lib/hooks/useIndexedDBSyncWithZustand';
import { useProgramsStore } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';
import { useState } from 'react';

export function useAddExerciseDrawerLogic(day: DayOfWeek) {
  const [open, setOpen] = useState(false);
  const { db } = useProgramsStore();
  const { syncDBWithZustand } = useIndexedDBSyncWithZustand();

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const addNewExercise = async (exercise: string) => {
    const programData = await db?.getItemByProgramName(day);

    programData?.exercises.push({ name: exercise });

    await db?.updateItem({ name: day, exercises: programData?.exercises ?? [] });
    syncDBWithZustand();

    onClose();
  };

  return {
    state: {
      open,
    },
    handlers: {
      onClose,
      showDrawer,
      addNewExercise,
    },
  };
}
