import React, { useRef } from 'react';
import styled from 'styled-components';
import Hero3D from '../components/Hero3D';
import ServiceCard from '../components/ServiceCard';
import ContactForm from '../components/ContactForm';
import { useLanguage } from '../context/LanguageContext';

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
  const servicesRef = useRef(null);
  const { t } = useLanguage();
  
  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  const services = [
    {
      id: 'vide-maison',
      title: t('videMaison'),
      description: t('videMaisonDesc'),
      image: './images/maison.jpg'
    },
    {
      id: 'vide-appartement',
      title: t('videAppartement'),
      description: t('videAppartementDesc'),
      image: '/images/appartement.jpg'
    },
    {
      id: 'vide-grenier',
      title: t('videGrenier'),
      description: t('videGrenierDesc'),
      image: '/images/Grenier.jpg'
    },
    {
      id: 'vide-locaux',
      title: t('videLocaux'),
      description: t('videLocauxDesc'),
      image: '/images/LocauxProfessionnels.jpg'
    },
    {
      id: 'vide-cave',
      title: t('videCave'),
      description: t('videCaveDesc'),
      image: '/images/Bureau.jpg'
    },
    {
      id: 'nettoyage',
      title: t('nettoyage'),
      description: t('nettoyageDesc'),
      image: '/images/Nettoyage.jpg'
    }
  ];
  
  return (
    <HomeContainer>
      <Hero3D scrollToServices={scrollToServices} />
      
      <ServicesSection ref={servicesRef} id="services">
        <SectionTitle>
          {t('ourServices')} <span>{t('services')}</span>
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
          {t('contactUs')} <span>{t('us')}</span>
        </SectionTitle>
        <ContactContainer>
          <ContactForm />
        </ContactContainer>
      </ContactSection>
    </HomeContainer>
  );
};

export default HomePage;