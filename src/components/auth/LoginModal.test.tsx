import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginModal from './LoginModal';
import { authService } from '@/services/auth.service';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/services/auth.service', () => ({
  authService: {
    signin: vi.fn(),
  },
}));

describe('LoginModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.signin).mockResolvedValue({ accessToken: 'token' });
  });

  it('submits the entered username and password', async () => {
    render(<LoginModal open onClose={vi.fn()} />);

    fireEvent.change(document.querySelector('input[name="username"]')!, {
      target: { value: 'jane' },
    });
    fireEvent.change(document.querySelector('input[name="password"]')!, {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(authService.signin).toHaveBeenCalledWith({
        username: 'jane',
        password: 'secret',
      });
    });
  });
});
