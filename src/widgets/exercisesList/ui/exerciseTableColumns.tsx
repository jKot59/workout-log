import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import { DataType } from './ExercisesItem';

export const getExerciseColumns = (handleDelete: (date: string) => void, handleSave: (record: DataType) => void) => {
  const defaultColumns: (ColumnType<DataType> & { editable?: boolean; dataIndex?: string })[] = [
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      width: '120px',
    },
    {
      title: 'SET 1',
      dataIndex: '0',
      key: 'set1',
      width: '100px',
      editable: true,
      render: (_, record) => record.reps[0],
    },
    {
      title: 'SET 2',
      dataIndex: '1',
      key: 'set2',
      width: '100px',
      editable: true,
      render: (_, record) => record.reps[1],
    },
    {
      title: 'SET 3',
      dataIndex: '2',
      key: 'set3',
      width: '100px',
      editable: true,
      render: (_, record) => record.reps[2],
    },
    {
      title: 'ACTION',
      key: 'operation',
      width: '100px',
      render: (_, record) => (
        <Popconfirm
          title='Delete set'
          description='Are you sure you want to delete this set?'
          onConfirm={() => handleDelete(record.date)}
          okText='Yes'
          cancelText='No'
        >
          <Button type='text' danger icon={<DeleteOutlined />} size='small' />
        </Popconfirm>
      ),
    },
  ];

  return defaultColumns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
};
