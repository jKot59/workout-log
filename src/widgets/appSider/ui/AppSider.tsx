'use client';

import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export function AppSider({ aboveMenuSlot }: Readonly<{ aboveMenuSlot: React.ReactNode }>) {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(() => [
    getItem('Monday', '1', <PieChartOutlined />),
    getItem('Thursday', '2', <DesktopOutlined />),
  ]);

  function addNewDay() {
    setItems((prev) => [...prev, getItem('X', 'x', <PieChartOutlined />)]);
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      {aboveMenuSlot}
      <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline' items={items} />
      <button onClick={addNewDay}> Add day</button>
    </Sider>
  );
}
