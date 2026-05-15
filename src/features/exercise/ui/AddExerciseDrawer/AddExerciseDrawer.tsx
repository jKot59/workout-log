'use client';

import { Button } from '@/shared/ui/button/Button';
import { DayOfWeek } from '@/widgets/appSider';
import { UploadOutlined } from '@ant-design/icons';
import { Drawer, Form, Input, Modal, Select, Upload } from 'antd';
import { muscleGroups } from '../../model/muscleGroups';
import { useAddExerciseDrawerLogic } from '../../model/useAddExerciseDrawerLogic';
import styles from './addExerciseDrawer.module.scss';
import { Exercise } from '../Exercise/Exercise';

export function AddExerciseDrawer({ day }: { day: DayOfWeek }) {
  const { state, handlers } = useAddExerciseDrawerLogic(day);

  return (
    <>
      <Button onClick={handlers.showDrawer}>Add exercise</Button>
      <Drawer title='Select the exercise' placement='bottom' closable={false} onClose={handlers.onCloseDrawer} open={state.isDrawerOpened}>
        <div className={styles.drawer_content}>
          <Exercise name={'Add new exercise'} image={'/images/exercises/add_new_image.jpeg'} onClick={() => handlers.setIsModalOpened(true)} />

          {state.exercises.map((exercise) => (
            <Exercise
              key={exercise.name}
              name={exercise.name}
              image={exercise.image}
              onClick={() => handlers.selectExerciseForTraining(exercise.name)}
            />
          ))}
        </div>
      </Drawer>

      <Modal
        title='New exercise creation'
        open={state.isModalOpened}
        onOk={handlers.handleSubmitNewExercise}
        onCancel={() => {
          state.form.resetFields();
          handlers.setIsModalOpened(false);
        }}
        destroyOnHidden
      >
        <Form form={state.form} layout='vertical'>
          <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Required' }]}>
            <Input />
          </Form.Item>

          <Form.Item name='muscleGroup' label='Muscle group(s)' rules={[{ required: true }]}>
            <Select mode='multiple' options={muscleGroups} />
          </Form.Item>

          <Form.Item name='image' label='Select image' valuePropName='fileList' getValueFromEvent={(e) => e.fileList}>
            <Upload
              listType='picture-card'
              beforeUpload={() => false} // prevents auto-upload
              maxCount={1}
            >
              <UploadOutlined />
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
