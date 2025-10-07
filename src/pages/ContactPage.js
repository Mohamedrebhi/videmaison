import React from 'react';
import styled from 'styled-components';
import ContactForm from '../components/ContactForm';

const PageContainer = styled.div`
  padding-top: 80px; // For navbar
`;

const HeroSection = styled.section`
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/contact-hero.jpg');
  background-size: cover;
  background-position: center;
  height: 300px;
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

const ContactSection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ContactTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ContactText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ContactInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  i {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
    margin-right: 1rem;
    width: 30px;
    text-align: center;
  }
`;

const MapContainer = styled.div`
  margin-top: 2rem;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 2rem;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ContactPage = () => {
  return (
    <PageContainer>
      <HeroSection>
        <div>
          <HeroTitle>
            Contactez <span>Nous</span>
          </HeroTitle>
        </div>
      </HeroSection>
      
      <ContactSection>
        <ContactContainer>
          <ContactInfo>
            <ContactTitle>Informations de Contact</ContactTitle>
            <ContactText>
              N'hésitez pas à nous contacter pour toute demande d'information ou pour obtenir un devis gratuit. Notre équipe est à votre disposition pour vous répondre dans les plus brefs délais.
            </ContactText>
            
            <ContactInfoItem>
              <i className="fas fa-map-marker-alt"></i>
              <div>Bruxelles, Belgique</div>
            </ContactInfoItem>
            
            <ContactInfoItem>
              <i className="fas fa-phone"></i>
              <div>+32 123 456 789</div>
            </ContactInfoItem>
            
            <ContactInfoItem>
              <i className="fas fa-envelope"></i>
              <div>info@videmaison.be</div>
            </ContactInfoItem>
            
            <ContactInfoItem>
              <i className="fas fa-clock"></i>
              <div>Lun - Ven: 8h - 18h<br />Sam: 9h - 16h</div>
            </ContactInfoItem>
            
            <MapContainer>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80600.40500255874!2d4.3053363!3d50.8550625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c486740f9fff%3A0x10099ab2f4c8030!2sBrussels%2C%20Belgium!5e0!3m2!1sen!2sus!4v1627900210987!5m2!1sen!2sus" 
                allowFullScreen="" 
                loading="lazy"
                title="Brussels Map"
              ></iframe>
            </MapContainer>
          </ContactInfo>
          
          <FormContainer>
            <ContactTitle>Envoyez-nous un Message</ContactTitle>
            <ContactForm />
          </FormContainer>
        </ContactContainer>
      </ContactSection>
    </PageContainer>
  );
};

export default ContactPage;