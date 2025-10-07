import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Card = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const CardImage = styled.div`
  height: 250px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${Card}:hover & img {
    transform: scale(1.1);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const CardButton = styled.button`
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ServiceCard = ({ title, description, image, onClick }) => {
  const { t } = useLanguage();
  
  return (
    <Card onClick={onClick}>
      <CardImage src={image} alt={title} />
      <CardOverlay />
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardButton>{t('learnMore')}</CardButton>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;