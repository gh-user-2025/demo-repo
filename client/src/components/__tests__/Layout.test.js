import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';
import { AuthProvider } from '../../context/AuthContext';

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com', role: 'developer' },
    logout: jest.fn()
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('Layout Component', () => {
  const renderLayout = (children = <div>Test Content</div>) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders the layout with navigation', () => {
    renderLayout();
    
    expect(screen.getByText(/project management system/i)).toBeInTheDocument();
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderLayout();
    
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderLayout();
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/projects/i)).toBeInTheDocument();
    expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderLayout(<div data-testid="custom-content">Custom Child Content</div>);
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText(/custom child content/i)).toBeInTheDocument();
  });
});
