// 1. Add fireEvent to your imports
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AdminDashboard from './AdminDashboard';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

test('renders empty state when no commissions exist', async () => {
  render(<AdminDashboard />);
  
  const passwordInput = screen.getByPlaceholderText(/Enter password/i);
  const loginButton = screen.getByRole('button', { name: /Login/i });

  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
  fireEvent.click(loginButton);

  const emptyMessage = await screen.findByText(/No commissions yet/i);
  expect(emptyMessage).toBeInTheDocument();
});