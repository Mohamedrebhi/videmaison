import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <FooterTitle>Vide Maison</FooterTitle>
          <FooterText>
            Nous sommes spécialisés dans le débarras de maisons, appartements, greniers, locaux professionnels et caves. Nous offrons également des services de nettoyage professionnel.
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
          <FooterTitle>Nos Services</FooterTitle>
          <FooterLink to="/services#vide-maison">Vide Maison</FooterLink>
          <FooterLink to="/services#vide-appartement">Vide Appartement</FooterLink>
          <FooterLink to="/services#vide-grenier">Vide Grenier</FooterLink>
          <FooterLink to="/services#vide-locaux">Vide Locaux Professionnels</FooterLink>
          <FooterLink to="/services#vide-cave">Vide Cave</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Liens Utiles</FooterTitle>
          <FooterLink to="/">Accueil</FooterLink>
          <FooterLink to="/about">À Propos</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/terms">Conditions d'Utilisation</FooterLink>
          <FooterLink to="/privacy">Politique de Confidentialité</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Contact</FooterTitle>
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
        © {new Date().getFullYear()} Vide Maison. Tous droits réservés.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;