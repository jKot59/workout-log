'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { InputRef } from 'antd';
import { DataType } from '../ui/ExercisesItem';
import { EditableContext } from '../ui/EditableRow';

interface UseEditableCellLogicProps {
  editable: boolean;
  dataIndex: keyof DataType | string;
  record: DataType;
  handleSave: (record: DataType) => void;
  columnIndex?: number;
  totalColumns?: number;
  currentRowKey?: string;
}

export function useEditableCellLogic({
  editable,
  dataIndex,
  record,
  handleSave,
  columnIndex,
  totalColumns,
  currentRowKey,
}: UseEditableCellLogicProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      const currentValue = record.reps[+dataIndex];
      if (currentValue === 0) {
        form.setFieldsValue({ [dataIndex]: '' });
      } else {
        form.setFieldsValue({ [dataIndex]: currentValue });
      }
    }
  }, [editing]);

  const toggleEdit = () => {
    if (editable) setEditing(!editing);
  };

  const moveToNextCell = () => {
    if (columnIndex !== undefined && totalColumns !== undefined && currentRowKey) {
      const nextIndex = columnIndex + 1;

      if (nextIndex < totalColumns) {
        setTimeout(() => {
          const nextCell = document.querySelector(
            `tr[data-row-key="${currentRowKey}"] td[data-col-index="${nextIndex}"] div[class="editable-cell-value-wrap"]`
          ) as HTMLElement;

          const isNextCellEmpty = nextCell?.innerText === '0' || nextCell?.innerText === '';

          if (nextCell && isNextCellEmpty) {
            const nextCellWrapper = nextCell.closest('.editable-cell-value-wrap');
            if (nextCellWrapper) {
              (nextCellWrapper as HTMLElement).click();
            }
          }
        }, 50);
      } else {
        setEditing(false);
      }
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      const recordReps = [...record.reps];
      const newValue = Object.values(values)[0];

      recordReps[+Object.keys(values)[0]] = newValue === '' || newValue === undefined ? 0 : newValue;

      handleSave({ ...record, reps: recordReps });
      moveToNextCell();

      if (columnIndex === undefined || columnIndex === totalColumns! - 1) {
        toggleEdit();
      } else {
        setEditing(false);
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  return {
    editing,
    inputRef,
    save,
    toggleEdit,
    isEditing: editing,
  };
}
