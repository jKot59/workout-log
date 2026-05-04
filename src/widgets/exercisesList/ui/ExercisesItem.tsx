import { Button } from '@/shared/ui/button/Button';
import { IExercise } from '@/stores/programs-store';
import { Card, Table, TableProps } from 'antd';
import { useExercisesItemLogic } from '../model/useExercisesItemLogic';
import { EditableCell } from './EditableCell';
import { EditableRow } from './EditableRow';
import { getExerciseColumns } from './exerciseTableColumns';

export interface DataType {
  date: string;
  reps: number[];
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

export function ExercisesItem({ name, sets }: IExercise) {
  const { state, handlers } = useExercisesItemLogic({ exerciseName: name, initialSets: sets });

  const columns = getExerciseColumns(handlers.handleDelete, handlers.handleSave);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <Card title={name}>
      <Button onClick={handlers.handleAdd}>Add a row</Button>

      <Table<DataType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={state.dataSource}
        columns={columns as ColumnTypes}
        rowKey={(record) => record.date}
      />
    </Card>
  );
}
