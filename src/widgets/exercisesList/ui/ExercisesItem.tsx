import { Button } from '@/shared/ui/button/Button';
import { IExercise, OneSet } from '@/shared/types/workout';
import { Card, Flex, Table, TableProps } from 'antd';
import { useExercisesItemLogic } from '../model/useExercisesItemLogic';
import { EditableCell } from './EditableCell';
import { EditableRow } from './EditableRow';
import { getExerciseColumns } from './exerciseTableColumns';

type ColumnTypes = Exclude<TableProps<OneSet>['columns'], undefined>;

export function ExercisesItem({ name, sets }: IExercise) {
  const { state, handlers } = useExercisesItemLogic({ exerciseName: name, initialSets: sets });

  const columns = getExerciseColumns(
    handlers.handleRemoveEquipment,
    handlers.handleAddEquipment,
    handlers.handleDelete,
    handlers.handleSave,
    state.amountSets,
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
      title={name}
      extra={
        <Flex gap={'small'}>
          <Button onClick={handlers.handleAdd}>Add a row</Button>
          {state.amountSets < 10 && <Button onClick={handlers.handleAddSet}>Add a set</Button>}
        </Flex>
      }
    >
      <Table<OneSet>
        rowHoverable={false}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        size={'small'}
        dataSource={state.dataSource}
        columns={columns as ColumnTypes}
        rowKey={(record) => record.date}
      />
    </Card>
  );
}
