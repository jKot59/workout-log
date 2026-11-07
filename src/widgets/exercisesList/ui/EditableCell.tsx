'use client';

import React from 'react';
import { Form, Input } from 'antd';
import { useEditableCellLogic } from '../model/useEditableCellLogic';
import { IEditableCellProps } from '../model/types';

export function EditableCell({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  columnIndex,
  totalColumns,
  currentRowKey,
  ...restProps
}: React.PropsWithChildren<IEditableCellProps>) {
  const { editing, inputRef, save, toggleEdit } = useEditableCellLogic({
    editable,
    record,
    handleSave,
    columnIndex,
    totalColumns,
    currentRowKey,
  });

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} placeholder={'0'} />
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' onClick={toggleEdit}>
        {/* if the cell has undefined value replace it with 0 */}
        {(children as unknown[]).every((child) => typeof child === 'undefined') ? '0' : children}
      </div>
    );
  }

  return (
    <td
      {...restProps}
      title={typeof title === 'string' ? title : undefined}
      data-col-index={columnIndex}
      data-row-key={currentRowKey}
    >
      {childNode}
    </td>
  );
}
