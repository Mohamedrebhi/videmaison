import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 1rem 0;
  }
`;

const LanguageButton = styled.button`
  background: ${({ active, theme }) => active ? theme.colors.secondary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  margin: 0 0.2rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <LanguageSelectorContainer>
      <LanguageButton 
        active={language === 'fr'} 
        onClick={() => setLanguage('fr')}
      >
        FR
      </LanguageButton>
      <LanguageButton 
        active={language === 'en'} 
        onClick={() => setLanguage('en')}
      >
        EN
      </LanguageButton>
      <LanguageButton 
        active={language === 'nl'} 
        onClick={() => setLanguage('nl')}
      >
        NL
      </LanguageButton>
    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;