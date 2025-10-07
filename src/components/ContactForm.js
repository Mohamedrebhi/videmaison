import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from '../utils/axiosConfig';
import { useLanguage } from '../context/LanguageContext';

const FormContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  &.full-width {
    grid-column: span 2;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      grid-column: span 1;
    }
  }
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.secondary};
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

// Improved Select component with better visibility
const Select = styled.select`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Increased border opacity */
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1); /* Increased background opacity */
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.secondary};
  transition: border-color 0.3s ease;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 1rem center;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  
  option {
    background-color: #1a1a1a; /* Dark background for options */
    color: white; /* White text for better visibility */
    padding: 10px; /* Add padding to options */
  }
  
  /* Add a hover effect to options */
  option:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Textarea = styled.textarea`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.secondary};
  resize: vertical;
  min-height: 150px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  grid-column: span 2;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-column: span 1;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled(motion.div)`
  background-color: rgba(40, 167, 69, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ContactForm = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service_type: '',
    message: '',
    language: '' // Add language field
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Update service types with translations
  const serviceTypes = [
    { id: 'vide_maison', name: t('videMaison') },
    { id: 'vide_appartement', name: t('videAppartement') },
    { id: 'vide_grenier', name: t('videGrenier') },
    { id: 'vide_locaux', name: t('videLocaux') },
    { id: 'vide_cave', name: t('videCave') }, // Changed from vide_bureau to vide_cave
    { id: 'nettoyage', name: t('nettoyage') }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    }
    
    if (!formData.address.trim()) {
      newErrors.address = t('addressRequired');
    }
    
    if (!formData.service_type) {
      newErrors.service_type = t('serviceRequired');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('messageRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Add the current language to the form data
        const formDataWithLanguage = {
          ...formData,
          language: language // Add the current language
        };
        
        // Replace with your actual API endpoint
        const response = await axios.post('http://localhost:5000/api/services/request', formDataWithLanguage);
        
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          service_type: '',
          message: '',
          language: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({
          ...errors,
          submit: t('errorSubmitting')
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <FormContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormTitle>{t('serviceRequest')}</FormTitle>
      
      {submitSuccess && (
        <SuccessMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {t('successMessage')}
        </SuccessMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">{t('name')}</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="address">{t('address')}</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width">
          <Label htmlFor="service_type">{t('serviceType')}</Label>
          <Select
            id="service_type"
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
          >
            <option value="">{t('selectService')}</option>
            {serviceTypes.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
          {errors.service_type && <ErrorMessage>{errors.service_type}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width">
          <Label htmlFor="message">{t('message')}</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
        </FormGroup>
        
        {errors.submit && (
          <FormGroup className="full-width">
            <ErrorMessage>{errors.submit}</ErrorMessage>
          </FormGroup>
        )}
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('sending') : t('send')}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default ContactForm;