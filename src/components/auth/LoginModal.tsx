'use client';

import { Modal, Form, Input, Button } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { authService } from '@/services/auth.service';

type FormValues = {
  username: string;
  password: string;
};

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { control, handleSubmit } = useForm<FormValues>(); //TODO useActionForm better?

  const onSubmit = handleSubmit(async (vals) => {
    try {
      await authService.signin(vals);
      onClose();
    } catch (e) {
      // TODO: show toster error
      console.error(e);
    }
  });

  return (
    <Modal title='Login' open={open} footer={null} onCancel={onClose}>
      <Form layout='vertical' onFinish={onSubmit}>
        <Form.Item label='User name'>
          <Controller name='username' control={control} defaultValue='' render={({ field }) => <Input {...field} />} />
        </Form.Item>
        <Form.Item label='Password'>
          <Controller name='password' control={control} defaultValue='' render={({ field }) => <Input.Password {...field} />} />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default LoginModal;
