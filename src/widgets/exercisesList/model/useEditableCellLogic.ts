'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { InputRef } from 'antd';
import { EditableContext } from '../ui/EditableRow';
import { IEditableCellProps } from './types';

type UseEditableCellLogicProps = Pick<
  IEditableCellProps,
  'editable' | 'record' | 'handleSave' | 'columnIndex' | 'totalColumns' | 'currentRowKey'
>;

export function useEditableCellLogic({
  editable,
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
      // const recordReps = [...record.exerciseSets[columnIndex + 1].reps];
      const recordReps = record.exerciseSets.find((set) => set.setNumber === columnIndex + 1);

      if (recordReps === undefined) throw Error('record not find');

      const newValue = Object.values(values)[0];
      const isValueChanged = +newValue === +recordReps.reps;

      if (isValueChanged) {
        setEditing(false);

        return;
      }

      recordReps.reps = newValue === '' || newValue === undefined ? '0' : String(newValue);

      handleSave(recordReps.id, recordReps.setNumber, recordReps.reps);
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
