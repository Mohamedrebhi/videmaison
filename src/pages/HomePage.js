import React, { useRef } from 'react';
import styled from 'styled-components';
import Hero3D from '../components/Hero3D';
import ServiceCard from '../components/ServiceCard';
import ContactForm from '../components/ContactForm';
import { useTranslation } from 'react-i18next'; // Nous gardons cette import pour la compatibilité

const HomeContainer = styled.div`
  width: 100%;
`;

const ServicesSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  
  span {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ContactSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HomePage = () => {
  const { t } = useTranslation(); // Nous gardons cette ligne pour la compatibilité
  const servicesRef = useRef(null);
  
  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  const services = [
    {
      id: 'vide-maison',
      title: 'Vide Maison',
      description: 'Service professionnel de débarras de maison complet',
      image: './images/maison.jpg'
    },
    {
      id: 'vide-appartement',
      title: 'Vide Appartement',
      description: 'Débarras d\'appartement rapide et efficace',
      image: '/images/appartement.jpg'
    },
    {
      id: 'vide-grenier',
      title: 'Vide Grenier',
      description: 'Nettoyage et débarras de greniers',
      image: '/images/Grenier.jpg'
    },
    {
      id: 'vide-locaux',
      title: 'Vide Locaux Professionnels',
      description: 'Débarras de locaux commerciaux et professionnels',
      image: '/images/LocauxProfessionnels.jpg'
    },
    {
      id: 'vide-cave',
      title: 'Vide Cave',
      description: 'Débarras et nettoyage de caves',
      image: '/images/Bureau.jpg'
    },
    {
      id: 'nettoyage',
      title: 'Service de Nettoyage',
      description: 'Nettoyage professionnel après débarras',
      image: '/images/Nettoyage.jpg'
    }
  ];
  
  return (
    <HomeContainer>
      <Hero3D scrollToServices={scrollToServices} />
      
      <ServicesSection ref={servicesRef} id="services">
        <SectionTitle>
          Nos Services <span>Professionnels</span>
        </SectionTitle>
        <ServicesGrid>
          {services.map(service => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              onClick={() => window.location.href = `/services#${service.id}`}
            />
          ))}
        </ServicesGrid>
      </ServicesSection>
      
      <ContactSection id="contact">
        <SectionTitle>
          Contactez <span>Nous</span>
        </SectionTitle>
        <ContactContainer>
          <ContactForm />
        </ContactContainer>
      </ContactSection>
    </HomeContainer>
  );
};

export default HomePage;