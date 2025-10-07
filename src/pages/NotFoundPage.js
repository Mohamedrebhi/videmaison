import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  line-height: 1;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 1rem 0 2rem;
`;

const ErrorDescription = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin-bottom: 2rem;
`;

const HomeButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-3px);
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Page Non Trouvée</ErrorTitle>
      <ErrorDescription>
        La page que vous recherchez n'existe pas ou a été déplacée.
        Veuillez vérifier l'URL ou retourner à la page d'accueil.
      </ErrorDescription>
      <HomeButton to="/">Retour à l'Accueil</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage;