'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './editableCell.module.scss';
import { Form, Input, InputRef } from 'antd';
import { DataType } from './ExercisesItem';
import { EditableContext } from './EditableRow';

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
}

export function EditableCell({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}: React.PropsWithChildren<EditableCellProps>) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record.reps[+dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();

      const recordReps = [...record.reps];

      recordReps[+Object.keys(values)[0]] = Object.values(values)[0];

      handleSave({ ...record, reps: recordReps });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} placeholder={'0'} />
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' style={{ paddingInlineEnd: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
}
