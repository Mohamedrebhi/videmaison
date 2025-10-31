import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LanguageButton = styled.button`
  background: ${props => props.active ? props.theme.colors.secondary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const LanguageIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.25rem;
`;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <LanguageContainer>
      {languages.map((language) => (
        <LanguageButton
          key={language.code}
          active={i18n.language === language.code}
          onClick={() => changeLanguage(language.code)}
          title={language.name}
        >
          <LanguageIcon>{language.flag}</LanguageIcon>
          {language.code.toUpperCase()}
        </LanguageButton>
      ))}
    </LanguageContainer>
  );
};

export default LanguageSwitcher;