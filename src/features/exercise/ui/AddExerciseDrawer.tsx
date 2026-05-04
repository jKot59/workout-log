'use client';

import { Button } from '@/shared/ui/button/Button';
import { DayOfWeek } from '@/widgets/appSider';
import { Drawer } from 'antd';
import { useAddExerciseDrawerLogic } from '../model/useAddExerciseDrawerLogic';

const exercisesList = [
  'Bulgarian split squats',
  'Calf raises',
  'Hindu push-ups',
  'Parallel bar dips',
  'Pull-ups',
  'Knee to chest on parallel bars',
  'Biceps pull-ups',
];

export function AddExerciseDrawer({ day }: { day: DayOfWeek }) {
  const { state, handlers } = useAddExerciseDrawerLogic(day);

  return (
    <>
      <Button onClick={handlers.showDrawer}>Add exercise</Button>

      <Drawer title='Basic Drawer' placement='bottom' closable={false} onClose={handlers.onClose} open={state.open}>
        {exercisesList.map((exercise) => (
          <div key={exercise} onClick={() => handlers.addNewExercise(exercise)}>
            {exercise}
          </div>
        ))}
      </Drawer>
    </>
  );
}
