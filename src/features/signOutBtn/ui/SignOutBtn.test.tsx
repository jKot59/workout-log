import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignOutBtn } from './SignOutBtn';
import authService from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth-store';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/services/auth.service', () => ({
  default: {
    signout: vi.fn(),
  },
}));

describe('SignOutBtn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();
    useAuthStore.setState({ accessToken: 'token', isAuthenticated: true });
  });

  it('does not redirect when signout request fails', async () => {
    vi.mocked(authService.signout).mockRejectedValue(new Error('Logout failed'));

    render(<SignOutBtn />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    await waitFor(() => {
      expect(authService.signout).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
