import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

const mockOnLogin = jest.fn();
const mockOnRegister = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    mockOnLogin.mockClear();
    mockOnRegister.mockClear();
  });

  it('renders login mode selection initially', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    expect(screen.getByText('AHP for Paper')).toBeInTheDocument();
    expect(screen.getByText('서비스 이용')).toBeInTheDocument();
    expect(screen.getByText('관리자 패널')).toBeInTheDocument();
  });

  it('switches to service login mode when service login button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('서비스 이용'));
    
    expect(screen.getByText('서비스 로그인')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /이메일/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
  });

  it('switches to admin login mode when admin login button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('관리자 패널'));
    
    expect(screen.getByText('관리자 로그인')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /이메일/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    
    const emailInput = screen.getByLabelText('이메일');
    const loginButton = screen.getByRole('button', { name: '로그인' });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(loginButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    
    const loginButton = screen.getByRole('button', { name: '로그인' });
    await user.click(loginButton);
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('calls onLogin with correct parameters for service login', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123', 'evaluator');
  });

  it('calls onLogin with correct parameters for admin login', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('관리자 로그인'));
    
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    const loginButton = screen.getByRole('button', { name: '로그인' });
    
    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'adminpass');
    await user.click(loginButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith('admin@example.com', 'adminpass', 'admin');
  });

  it('displays loading state', () => {
    render(<LoginForm onLogin={mockOnLogin} loading={true} />);
    
    // Initial selection screen should still show when loading
    expect(screen.getByText('AHP Decision System')).toBeInTheDocument();
  });

  it('displays error message', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Login failed';
    render(<LoginForm onLogin={mockOnLogin} error={errorMessage} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows register option when onRegister is provided', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    
    expect(screen.getByText('계정이 없으신가요?')).toBeInTheDocument();
    expect(screen.getByText('회원가입')).toBeInTheDocument();
  });

  it('calls onRegister when register link is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} onRegister={mockOnRegister} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    await user.click(screen.getByText('회원가입'));
    
    expect(mockOnRegister).toHaveBeenCalled();
  });

  it('allows going back to selection from login mode', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    await user.click(screen.getByText('← 돌아가기'));
    
    expect(screen.getByText('서비스 로그인')).toBeInTheDocument();
    expect(screen.getByText('관리자 로그인')).toBeInTheDocument();
  });

  it('handles form submission with Enter key', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    await user.click(screen.getByText('서비스 로그인'));
    
    const emailInput = screen.getByLabelText('이메일');
    const passwordInput = screen.getByLabelText('비밀번호');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.keyboard('{Enter}');
    
    expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123', 'evaluator');
  });
});