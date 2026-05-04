import { useProgramsStore } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';
import { useState } from 'react';

export function useAddExerciseDrawerLogic(day: DayOfWeek) {
  const [open, setOpen] = useState(false);
  const { db } = useProgramsStore();
  const { update } = useProgramsStore();

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const addNewExercise = async (exercise: string) => {
    const programData = await db?.getItemByProgramName(day);

    programData?.exercises.push({ name: exercise });

    await db?.updateItem({ name: day, exercises: programData?.exercises ?? [] });
    const programs = await db?.getAllItems();

    if (programs) update(programs);

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
