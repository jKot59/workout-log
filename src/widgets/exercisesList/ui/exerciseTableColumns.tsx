import { Button, Dropdown, Flex, MenuProps, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import { IExerciseRecord, OneSet } from '@/shared/types/workout';
import { IEquipmentStore } from '@/stores/equipment-store';
import { transformDateToUserFriendly } from '@/shared/lib/helpers/transformDateToUserFriendly';
import { IEditableCellProps } from '../model/types';

export const getExerciseColumns = (
  handleRemoveEquipment: (date: OneSet['id'], equipmentId: OneSet['equipmentList'][0]['id']) => void,
  handleAddEquipment: (date: OneSet['id'], equipmentId: OneSet['equipmentList'][0]) => void,
  handleDelete: (date: OneSet['id']) => void,
  handleSave: IEditableCellProps['handleSave'],
  setsCount: number,
  equipmentList: IEquipmentStore['equipmentList']
) => {
  const setColumns: (ColumnType<NonNullable<IExerciseRecord>> & { editable?: boolean; dataIndex?: string; colIndex?: number })[] = Array.from(
    { length: setsCount },
    (_, index) => ({
      title: `SET ${index + 1}`,
      dataIndex: index.toString(),
      key: `set${index + 1}`,
      width: '100px',
      editable: true,
      colIndex: index,
      render: (_: unknown, record: NonNullable<IExerciseRecord>) => record.exerciseSets[index].reps,
    })
  );

  // Equipment menu items (only unused values)
  const getEquipmentMenuItems = (record: OneSet): MenuProps['items'] => {
    const usedIds = new Set(record.equipmentList.map(({ id }) => id));

    const onlyUnusedEquipment = equipmentList.filter(({ id }) => !usedIds.has(id));

    return onlyUnusedEquipment.map((curr) => ({
      key: curr.id,
      label: curr.name ?? 'No name',
      onClick: () => handleAddEquipment(record.id, curr),
    }));
  };

  const defaultColumns: (ColumnType<IExerciseRecord> & { editable?: boolean; dataIndex?: string; colIndex?: number })[] = [
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      width: '120px',
      render: (_, record) => transformDateToUserFriendly(String(record.date)),
    },
    ...setColumns,
    // {
    //   title: 'EQUIPMENT',
    //   key: 'equipment',
    //   width: 100,
    //   render: (_, record) => {
    //     return (
    //       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    //         <Flex gap={4}>
    //           {record.equipmentList && record.equipmentList.length > 0
    //             ? record.equipmentList.map((equipment) => {
    //                 return (
    //                   <Tag key={equipment.id} closable={true} onClose={() => handleRemoveEquipment(record.id, equipment.id)}>
    //                     {equipment.name}
    //                   </Tag>
    //                 );
    //               })
    //             : 'No equipment'}
    //         </Flex>

    //         {/* <Dropdown menu={{ items: getEquipmentMenuItems(record) }} trigger={['click']} disabled={equipmentList.length === 0}>
    //           {equipmentList.length !== record.equipmentList?.length && (
    //             <Button type='text' size='small' icon={<PlusOutlined />} disabled={equipmentList.length === 0} />
    //           )}
    //         </Dropdown> */}
    //       </div>
    //     );
    //   },
    // },
    {
      title: 'ACTION',
      key: 'operation',
      width: '100px',
      render: (_, record) => (
        <Popconfirm
          title='Delete set'
          description='Are you sure you want to delete this set?'
          onConfirm={() => handleDelete(record.id)}
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
      onCell: (record: IExerciseRecord) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        columnIndex: col.colIndex, // Pass column index
        totalColumns: setsCount, // Pass total number of set columns
        currentRowKey: record.id, // Pass row key
      }),
    };
  });
};
