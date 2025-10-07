import React from 'react';
import styled from 'styled-components';

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
  return (
    <PageContainer>
      <HeroSection>
        <div>
          <HeroTitle>
            À Propos de <span>Nous</span>
          </HeroTitle>
          <HeroSubtitle>
            Découvrez notre histoire, notre mission et nos valeurs qui font de nous le leader du service de vide maison à Bruxelles.
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
              <p>
                Fondée en 2010, notre entreprise de vide maison a débuté avec une vision simple : offrir un service de débarras professionnel, respectueux et éco-responsable aux habitants de Bruxelles et ses environs.
              </p>
              <p>
                Au fil des années, nous avons développé notre expertise et élargi notre gamme de services pour répondre aux besoins variés de notre clientèle, qu'il s'agisse de particuliers ou de professionnels.
              </p>
              <p>
                Aujourd'hui, nous sommes fiers d'être reconnus comme l'un des leaders du secteur, avec des milliers d'interventions réussies et un taux de satisfaction client exceptionnel.
              </p>
            </AboutText>
          </AboutContent>
          
          <AboutContent>
            <AboutText>
              <h2>Notre Mission</h2>
              <p>
                Notre mission est de vous offrir une solution complète et sans stress pour tous vos besoins de débarras et nettoyage, que ce soit suite à un déménagement, une succession, ou simplement pour faire de la place.
              </p>
              <p>
                Nous nous engageons à fournir un service de qualité supérieure, avec une attention particulière portée à la valorisation des objets et au recyclage des déchets, dans une démarche éco-responsable.
              </p>
              <p>
                Notre équipe de professionnels travaille avec respect, efficacité et discrétion pour vous garantir une expérience positive et un résultat impeccable.
              </p>
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
            <p>Nous abordons chaque projet avec sérieux et compétence, en veillant à respecter nos engagements et à dépasser vos attentes.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-leaf"></i>
            <h3>Éco-responsabilité</h3>
            <p>Nous privilégions le recyclage et la valorisation des objets, en minimisant l'impact environnemental de nos activités.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-heart"></i>
            <h3>Respect</h3>
            <p>Nous traitons vos biens et votre propriété avec le plus grand soin, en faisant preuve de discrétion et d'empathie.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-bolt"></i>
            <h3>Efficacité</h3>
            <p>Nous travaillons rapidement et méthodiquement pour vous offrir un service impeccable dans les délais convenus.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-comments"></i>
            <h3>Communication</h3>
            <p>Nous maintenons un dialogue ouvert et transparent avec nos clients tout au long du processus.</p>
          </ValueCard>
          
          <ValueCard>
            <i className="fas fa-thumbs-up"></i>
            <h3>Satisfaction</h3>
            <p>Votre satisfaction est notre priorité absolue, et nous ne ménageons aucun effort pour l'atteindre.</p>
          </ValueCard>
        </ValuesGrid>
      </ValuesSection>
    </PageContainer>
  );
};

export default AboutPage;