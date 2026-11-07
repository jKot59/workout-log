import { Button } from '@/shared/ui/button/Button';
import { IExercise, IExerciseRecord } from '@/shared/types/workout';
import { Card, Flex, Table, TableProps } from 'antd';
import { useExercisesItemLogic } from '../model/useExercisesItemLogic';
import { EditableCell } from './EditableCell';
import { EditableRow } from './EditableRow';
import { getExerciseColumns } from './exerciseTableColumns';
import { DeleteProgramExerciseBtn } from '@/features/deleteProgramExerciseBtn';

type ColumnTypes = Exclude<TableProps<IExerciseRecord>['columns'], undefined>;

export function ExercisesItem({ exercise }: { exercise: IExercise }) {
  const { state, handlers } = useExercisesItemLogic(exercise);

  const columns = getExerciseColumns(
    handlers.handleRemoveEquipment,
    handlers.handleAddEquipment,
    handlers.handleDelete,
    handlers.handleSave,
    exercise.exerciseRecords.reduce((acc, curr) => {
      return curr.exerciseSets.length > acc ? curr.exerciseSets.length : acc;
    }, 0),
    state.equipmentList
  );

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Card
      title={
        <Flex align='center' gap='small'>
          {state.catalogExercise?.name}
          <DeleteProgramExerciseBtn
            data-testid='delete exercise'
            programExerciseId={exercise.id}
            // className={styles.delete_btn}
          />
        </Flex>
      }
      extra={
        <Flex gap={'small'}>
          <Button onClick={() => handlers.onAddExerciseRecord(exercise.id)}>New record</Button>
          {2 < 10 && <Button onClick={handlers.handleAddSet}>Add a set</Button>}
        </Flex>
      }
    >
      <Table<IExerciseRecord>
        rowHoverable={false}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        size={'small'}
        dataSource={exercise.exerciseRecords}
        columns={columns as ColumnTypes}
        rowKey={(record) => record.id}
      />
    </Card>
  );
}
