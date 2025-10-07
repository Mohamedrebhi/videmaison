import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: 3rem;
  width: 100%;
  max-width: 500px;
`;

const LoginTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 5px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 1.5rem;
  text-align: center;
  font-weight: 500;
`;

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, error, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if already authenticated as admin
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await login(email, password);
    
    setIsSubmitting(false);
    
    if (success && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  };
  
  return (
    <PageContainer>
      <LoginCard>
        <LoginTitle>Admin Login</LoginTitle>
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </SubmitButton>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginForm>
      </LoginCard>
    </PageContainer>
  );
};

export default AdminLoginPage;