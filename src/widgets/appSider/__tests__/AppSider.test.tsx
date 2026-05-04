import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AppSider } from '../ui/AppSider';
import { useAppSiderLogic } from '../model/useAppSiderLogic';

type MenuItem = {
  key: string;
  label: React.ReactNode;
};

type UseAppSiderLogicReturn = {
  state: {
    collapsed: boolean;
    menuItems: string[];
    availableDays: string[];
    isAvailableDaysListShown: boolean;
  };
  handlers: {
    setCollapsed: (value: boolean) => void;
    toggleDaysList: () => void;
    handleSelectDay: (day: string) => void;
    createMenuItem: (label: React.ReactNode, key: string) => MenuItem;
  };
};

// Mock the custom hook
vi.mock('../model/useAppSiderLogic');

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

// Mock Ant Design Menu
vi.mock('antd', () => ({
  Menu: ({ items, theme, mode, className }: { items?: MenuItem[]; theme?: string; mode?: string; className?: string }) => (
    <div data-testid='menu' className={className} data-theme={theme} data-mode={mode}>
      {items?.map((item) => (
        <div key={item.key} data-testid={`menu-item-${item.key}`}>
          {item.label}
        </div>
      ))}
    </div>
  ),
}));

// Mock Ant Design Sider
vi.mock('antd/es/layout/Sider', () => ({
  default: ({
    children,
    collapsible,
    collapsed,
    onCollapse,
  }: {
    children: React.ReactNode;
    collapsible?: boolean;
    collapsed?: boolean;
    onCollapse?: (value: boolean) => void;
  }) => (
    <div data-testid='sider' data-collapsed={collapsed} data-collapsible={collapsible} onClick={() => onCollapse?.(!collapsed)}>
      {children}
    </div>
  ),
}));

// Mock ViewTransition
vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    ViewTransition: ({ children, enter, exit }: { children: React.ReactNode; enter?: string; exit?: string }) => (
      <div data-testid='view-transition' data-enter={enter} data-exit={exit}>
        {children}
      </div>
    ),
  };
});

// Mock styles
vi.mock('../ui/appSider.module.scss', () => ({
  default: {
    menu: 'menu-class',
    empty_day: 'empty-day-class',
    days_list: 'days-list-class',
    btn: 'btn-class',
    list: 'list-class',
    day: 'day-class',
  },
}));

describe('AppSider', () => {
  const mockHandlers: UseAppSiderLogicReturn['handlers'] = {
    setCollapsed: vi.fn(),
    toggleDaysList: vi.fn(),
    handleSelectDay: vi.fn(),
    createMenuItem: vi.fn((label, key) => ({ key, label })),
  };

  const defaultMockState: UseAppSiderLogicReturn = {
    state: {
      collapsed: false,
      menuItems: [],
      availableDays: ['Monday', 'Tuesday', 'Wednesday'],
      isAvailableDaysListShown: false,
    },
    handlers: mockHandlers,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppSiderLogic as unknown as Mock).mockReturnValue(defaultMockState);
  });

  describe('rendering', () => {
    it('should render Sider component', () => {
      render(<AppSider aboveMenuSlot={<div>Above Menu Slot</div>} />);
      expect(screen.getByTestId('sider')).toBeDefined();
    });

    it('should render aboveMenuSlot content', () => {
      render(<AppSider aboveMenuSlot={<div data-testid='slot-content'>Custom Content</div>} />);
      expect(screen.getByTestId('slot-content')).toBeDefined();
      expect(screen.getByText('Custom Content')).toBeDefined();
    });

    it('should render menu when menuItems are available', () => {
      const stateWithItems = {
        ...defaultMockState,
        state: {
          ...defaultMockState.state,
          menuItems: ['Monday', 'Wednesday', 'Friday'],
        },
      };
      (useAppSiderLogic as unknown as Mock).mockReturnValue(stateWithItems);

      render(<AppSider aboveMenuSlot={null} />);

      expect(screen.getByTestId('menu')).toBeDefined();
      expect(screen.getByTestId('menu-item-Monday')).toBeDefined();
      expect(screen.getByTestId('menu-item-Wednesday')).toBeDefined();
      expect(screen.getByTestId('menu-item-Friday')).toBeDefined();
    });

    it('should render empty state message when no menuItems', () => {
      render(<AppSider aboveMenuSlot={null} />);
      expect(screen.getByText('No trainings')).toBeDefined();
    });

    it('should render Add day button when availableDays exist', () => {
      render(<AppSider aboveMenuSlot={null} />);
      expect(screen.getByText('Add day')).toBeDefined();
    });

    it('should not render Add day button when no availableDays', () => {
      const stateNoDays = {
        ...defaultMockState,
        state: {
          ...defaultMockState.state,
          availableDays: [],
        },
      };
      (useAppSiderLogic as unknown as Mock).mockReturnValue(stateNoDays);

      render(<AppSider aboveMenuSlot={null} />);
      expect(screen.queryByText('Add day')).toBeNull();
    });
  });

  describe('collapsible behavior', () => {
    it('should pass collapsed state to Sider', () => {
      const stateCollapsed = {
        ...defaultMockState,
        state: {
          ...defaultMockState.state,
          collapsed: true,
        },
      };
      (useAppSiderLogic as unknown as Mock).mockReturnValue(stateCollapsed);

      render(<AppSider aboveMenuSlot={null} />);

      const sider = screen.getByTestId('sider');
      expect(sider.getAttribute('data-collapsed')).toBe('true');
    });

    it('should call setCollapsed when Sider onCollapse is triggered', () => {
      render(<AppSider aboveMenuSlot={null} />);

      const sider = screen.getByTestId('sider');
      fireEvent.click(sider);

      expect(mockHandlers.setCollapsed).toHaveBeenCalledWith(true);
    });
  });

  describe('days list functionality', () => {
    it('should show available days list when isAvailableDaysListShown is true', () => {
      const stateWithListShown = {
        ...defaultMockState,
        state: {
          ...defaultMockState.state,
          isAvailableDaysListShown: true,
          availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        },
      };
      (useAppSiderLogic as unknown as Mock).mockReturnValue(stateWithListShown);

      render(<AppSider aboveMenuSlot={null} />);

      expect(screen.getByText('Monday')).toBeDefined();
      expect(screen.getByText('Tuesday')).toBeDefined();
      expect(screen.getByText('Wednesday')).toBeDefined();
      expect(screen.getByTestId('view-transition')).toBeDefined();
    });

    it('should not show available days list when isAvailableDaysListShown is false', () => {
      render(<AppSider aboveMenuSlot={null} />);

      expect(screen.queryByText('Monday')).toBeNull();
      expect(screen.queryByTestId('view-transition')).toBeNull();
    });

    it('should show Cancel button when list is shown', () => {
      const stateWithListShown = {
        ...defaultMockState,
        state: {
          ...defaultMockState.state,
          isAvailableDaysListShown: true,
        },
      };
      (useAppSiderLogic as unknown as Mock).mockReturnValue(stateWithListShown);

      render(<AppSider aboveMenuSlot={null} />);

      expect(screen.getByText('Cancel')).toBeDefined();
      expect(screen.queryByText('Add day')).toBeNull();
    });

    it('should call toggleDaysList when Add day/Cancel button is clicked', () => {
      render(<AppSider aboveMenuSlot={null} />);

      const button = screen.getByText('Add day');
      fireEvent.click(button);

      expect(mockHandlers.toggleDaysList).toHaveBeenCalled();
    });
  });

  describe('day selection', () => {
    it('should call handleSelectDay when clicking on a day in the list', () => {
      const stateWithListShown = {
        ...defaultMockState,
        state: {
          ...defaultMockState.state,
          isAvailableDaysListShown: true,
          availableDays: ['Monday', 'Tuesday'],
        },
      };
      (useAppSiderLogic as unknown as Mock).mockReturnValue(stateWithListShown);

      render(<AppSider aboveMenuSlot={null} />);

      const mondayItem = screen.getByText('Monday');
      fireEvent.click(mondayItem);

      expect(mockHandlers.handleSelectDay).toHaveBeenCalledWith('Monday');
    });
  });

  describe('menu item links', () => {
    it('should create proper links for each day', () => {
      const stateWithItems = {
        ...defaultMockState,
        state: {
          ...defaultMockState.state,
          menuItems: ['Monday', 'Wednesday'],
        },
      };
      (useAppSiderLogic as unknown as Mock).mockReturnValue(stateWithItems);

      // Override createMenuItem to capture the Link component
      (mockHandlers.createMenuItem as Mock).mockImplementation((label) => ({ label }));

      render(<AppSider aboveMenuSlot={null} />);

      // Check that createMenuItem was called with Link components
      expect(mockHandlers.createMenuItem).toHaveBeenCalled();
      const calls = (mockHandlers.createMenuItem as Mock).mock.calls;

      // Verify that the first argument is a Link component with correct href
      const firstCallLink = calls[0][0];
      expect(firstCallLink.props.href).toBe('monday');
    });
  });
});
