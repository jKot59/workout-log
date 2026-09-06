import { Header } from 'antd/es/layout/layout';
import styles from './mainHeader.module.scss';
import { SignOutBtn } from '@/features/signOutBtn';

export function MainHeader() {
  return (
    <Header className={styles.header}>
      <SignOutBtn />
    </Header>
  );
}
