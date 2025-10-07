import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 4rem 0 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FooterText = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
`;

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <FooterTitle>Vide Maison</FooterTitle>
          <FooterText>
            {t('companyDescription')}
          </FooterText>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </SocialLink>
          </SocialLinks>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>{t('services')}</FooterTitle>
          <FooterLink to="/services#vide-maison">{t('videMaison')}</FooterLink>
          <FooterLink to="/services#vide-appartement">{t('videAppartement')}</FooterLink>
          <FooterLink to="/services#vide-grenier">{t('videGrenier')}</FooterLink>
          <FooterLink to="/services#vide-locaux">{t('videLocaux')}</FooterLink>
          <FooterLink to="/services#vide-cave">{t('videCave')}</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>{t('usefulLinks')}</FooterTitle>
          <FooterLink to="/">{t('home')}</FooterLink>
          <FooterLink to="/about">{t('about')}</FooterLink>
          <FooterLink to="/contact">{t('contact')}</FooterLink>
          <FooterLink to="/terms">{t('termsOfUse')}</FooterLink>
          <FooterLink to="/privacy">{t('privacyPolicy')}</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>{t('contact')}</FooterTitle>
          <FooterText>
            <i className="fas fa-map-marker-alt"></i> Bruxelles, Belgique
          </FooterText>
          <FooterText>
            <i className="fas fa-phone"></i> +32 123 456 789
          </FooterText>
          <FooterText>
            <i className="fas fa-envelope"></i> info@videmaison.be
          </FooterText>
        </FooterColumn>
      </FooterContent>
      
      <Copyright>
        &copy; {new Date().getFullYear()} Vide Maison. {t('allRightsReserved')}
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;