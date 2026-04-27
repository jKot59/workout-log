'use client';

import { useState } from 'react';
import { Drawer } from 'antd';
import { Button } from '@/shared/ui/button/Button';
import { IndexedDBManager } from '@/shared/lib/indexedDB/IndexedDBManager';
import { useProgramsStore } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';

const exercisesList = [
  'Bulgarian split squats',
  'Calf raises',
  'Hindu push-ups',
  'Parallel bar dips',
  'Pull-ups',
  'Knee to chest on parallel bars',
  'Biceps push-ups',
];

export function AddExerciseDrawer({ day }: { day: DayOfWeek }) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const db = new IndexedDBManager('WorkoutLogDatabase', 1, 'exercises');

  const { update } = useProgramsStore();

  return (
    <>
      <Button onClick={showDrawer}>Add exercise</Button>

      <Drawer title='Basic Drawer' placement='bottom' closable={false} onClose={onClose} open={open}>
        {exercisesList.map((exercise) => (
          <div
            key={exercise}
            onClick={async () => {
              await db.openDB();

              const programData = await db.getItemByProgramName(day);

              programData?.exercises.push({ name: exercise, sets: [{ reps: 0 }, { reps: 0 }] });

              await db.updateItem({ name: day, exercises: programData?.exercises ?? [] });
              const programs = await db.getAllItems();

              update(programs);
              onClose();
            }}
          >
            {exercise}
          </div>
        ))}
      </Drawer>
    </>
  );
}
