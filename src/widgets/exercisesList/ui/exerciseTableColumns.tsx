import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import { DataType } from './ExercisesItem';

export const getExerciseColumns = (handleDelete: (date: string) => void, handleSave: (record: DataType) => void, setsCount: number) => {
  const setColumns: (ColumnType<DataType> & { editable?: boolean; dataIndex?: string; colIndex?: number })[] = Array.from(
    { length: setsCount },
    (_, index) => ({
      title: `SET ${index + 1}`,
      dataIndex: index.toString(),
      key: `set${index + 1}`,
      width: '100px',
      editable: true,
      colIndex: index,
      render: (_: unknown, record: DataType) => record.reps[index],
    })
  );

  const defaultColumns: (ColumnType<DataType> & { editable?: boolean; dataIndex?: string; colIndex?: number })[] = [
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      width: '120px',
    },
    ...setColumns,
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
        columnIndex: col.colIndex, // Pass column index
        totalColumns: setsCount, // Pass total number of set columns
        currentRowKey: record.date, // Pass row key
      }),
    };
  });
};
