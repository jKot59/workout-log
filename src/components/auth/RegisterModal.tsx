'use client';

import { Modal, Form, Input, Button } from 'antd';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type FormValues = {
  email: string;
  password: string;
  name?: string;
};

export function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit = handleSubmit(async (vals) => {
    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vals),
        credentials: 'include',
      });
      onClose();
      router.push('/dashboard');
      // window.location.href = '/dashboard';
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <Modal title='Register' open={open} footer={null} onCancel={onClose}>
      <Form layout='vertical' onFinish={onSubmit}>
        <Form.Item label='Name'>
          <Input {...register('name')} />
        </Form.Item>
        <Form.Item label='Email'>
          <Input {...register('email')} />
        </Form.Item>
        <Form.Item label='Password'>
          <Input.Password {...register('password')} />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Create account
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RegisterModal;
