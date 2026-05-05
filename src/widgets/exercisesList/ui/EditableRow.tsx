import { Form, FormInstance } from 'antd';
import React from 'react';

interface EditableRowProps {
  index: number;
}

export const EditableContext = React.createContext<FormInstance<Record<string, string | number>> | null>(null);

export function EditableRow({ index, ...props }: EditableRowProps) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}
