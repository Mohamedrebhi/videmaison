import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const PageContainer = styled.div`
  padding-top: 80px; // For navbar
`;

const HeroSection = styled.section`
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/about-hero.jpg');
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  
  span {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const AboutSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const AboutImage = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AboutText = styled.div`
  h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.1rem;
  }
`;

const ValuesSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const ValuesTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ValueCard = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  i {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.6;
  }
`;

const AboutPage = () => {
  const { t } = useTranslation();
  
  return (
    <PageContainer>
      <HeroSection>
        <div>
          <HeroTitle>À <span>Propos</span></HeroTitle>
          <HeroSubtitle>
            Découvrez notre histoire, notre mission et nos valeurs
          </HeroSubtitle>
        </div>
      </HeroSection>
      
      <AboutSection>
        <AboutContainer>
          <AboutContent>
            <AboutImage>
              <img src="/images/about-company.jpg" alt="Notre entreprise" />
            </AboutImage>
            <AboutText>
              <h2>Notre Histoire</h2>
              <p>Fondée en 2015, VideMaison est née de la passion de son fondateur pour aider les gens à se libérer de l'encombrement et à donner une seconde vie aux objets.</p>
              <p>Au fil des années, nous avons développé une expertise dans tous les types de débarras, des maisons aux locaux professionnels, en passant par les appartements, les greniers et les caves.</p>
              <p>Aujourd'hui, nous sommes fiers d'être reconnus comme un acteur majeur du débarras et du nettoyage dans la région, avec une réputation d'excellence et de fiabilité.</p>
            </AboutText>
          </AboutContent>
          
          <AboutContent>
            <AboutText>
              <h2>Notre Mission</h2>
              <p>Chez VideMaison, notre mission est de fournir des services de débarras et de nettoyage de haute qualité, tout en respectant l'environnement et en valorisant au maximum les objets récupérés.</p>
              <p>Nous nous engageons à offrir un service personnalisé, adapté aux besoins spécifiques de chaque client, qu'il s'agisse de particuliers ou de professionnels.</p>
              <p>Notre objectif est de simplifier la vie de nos clients en leur offrant une solution clé en main pour se débarrasser de leurs objets indésirables, tout en leur garantissant un service rapide, efficace et respectueux.</p>
            </AboutText>
            <AboutImage>
              <img src="/images/about-mission.jpg" alt="Notre mission" />
            </AboutImage>
          </AboutContent>
        </AboutContainer>
      </AboutSection>
      
      <ValuesSection>
        <ValuesTitle>Nos Valeurs</ValuesTitle>
        <ValuesGrid>
          <ValueCard>
            <i className="fas fa-handshake"></i>
            <h3>Professionnalisme</h3>
            <p>Nous abordons chaque projet avec sérieux et compétence, en veillant à respecter les délais et à fournir un travail de qualité.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-leaf"></i>
            <h3>Éco-responsabilité</h3>
            <p>Nous nous engageons à minimiser notre impact environnemental en recyclant et en valorisant au maximum les objets récupérés.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-heart"></i>
            <h3>Respect</h3>
            <p>Nous traitons chaque client, chaque objet et chaque espace avec le plus grand respect, en reconnaissant la valeur sentimentale que peuvent avoir certains biens.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-bolt"></i>
            <h3>Efficacité</h3>
            <p>Nous travaillons de manière rapide et organisée pour minimiser les perturbations et permettre à nos clients de retrouver rapidement un espace propre et fonctionnel.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-comments"></i>
            <h3>Communication</h3>
            <p>Nous maintenons une communication claire et transparente avec nos clients tout au long du processus, en les tenant informés de l'avancement des travaux.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-thumbs-up"></i>
            <h3>Satisfaction client</h3>
            <p>Notre priorité absolue est la satisfaction de nos clients, et nous mettons tout en œuvre pour dépasser leurs attentes et leur offrir une expérience positive.</p>
          </ValueCard>
        </ValuesGrid>
      </ValuesSection>
    </PageContainer>
  );
};

export default AboutPage;