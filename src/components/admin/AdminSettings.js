import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axiosConfig';

const SettingsContainer = styled.div`
  h1 {
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SettingsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  margin-bottom: 2rem;
`;

const SettingsTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ToggleLabel = styled.label`
  margin-left: 1rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.secondary : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ active }) => active ? '33px' : '3px'};
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s ease;
  }
`;

const AdminSettings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    soundAlerts: true
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Load user profile data
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
    
    // Load notification settings (would come from API in real implementation)
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
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
  
  const toggleNotificationSetting = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Le mot de passe actuel est requis';
      }
      
      if (profileData.newPassword.length < 8) {
        newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      setIsSubmitting(true);
      setSuccessMessage('');
      
      try {
        // In a real implementation, you would update via your API
        // For now, we'll just simulate a successful update
        setTimeout(() => {
          setSuccessMessage('Profil mis à jour avec succès');
          setProfileData({
            ...profileData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setIsSubmitting(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to update profile:', error);
        setErrors({
          ...errors,
          submit: 'Une erreur est survenue. Veuillez réessayer plus tard.'
        });
        setIsSubmitting(false);
      }
    }
  };
  
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      // In a real implementation, you would update via your API
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setSuccessMessage('Paramètres de notification mis à jour avec succès');
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      setErrors({
        ...errors,
        notificationSubmit: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <SettingsContainer>
      <h1>Paramètres</h1>
      
      <SettingsCard>
        <SettingsTitle>Profil Administrateur</SettingsTitle>
        
        <Form onSubmit={handleProfileSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nom</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup className="full-width">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={profileData.currentPassword}
              onChange={handleProfileChange}
            />
            {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={profileData.newPassword}
              onChange={handleProfileChange}
            />
            {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={profileData.confirmPassword}
              onChange={handleProfileChange}
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </FormGroup>
          
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          
          <FormGroup className="full-width">
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le profil'}
            </SubmitButton>
          </FormGroup>
        </Form>
      </SettingsCard>
      
      <SettingsCard>
        <SettingsTitle>Paramètres de Notification</SettingsTitle>
        
        <form onSubmit={handleNotificationSubmit}>
          <ToggleContainer>
            <ToggleSwitch 
              active={notificationSettings.emailNotifications}
              onClick={() => toggleNotificationSetting('emailNotifications')}
            />
            <ToggleLabel onClick={() => toggleNotificationSetting('emailNotifications')}>
              Notifications par email
            </ToggleLabel>
          </ToggleContainer>
          
          <ToggleContainer>
            <ToggleSwitch 
              active={notificationSettings.browserNotifications}
              onClick={() => toggleNotificationSetting('browserNotifications')}
            />
            <ToggleLabel onClick={() => toggleNotificationSetting('browserNotifications')}>
              Notifications du navigateur
            </ToggleLabel>
          </ToggleContainer>
          
          <ToggleContainer>
            <ToggleSwitch 
              active={notificationSettings.soundAlerts}
              onClick={() => toggleNotificationSetting('soundAlerts')}
            />
            <ToggleLabel onClick={() => toggleNotificationSetting('soundAlerts')}>
              Alertes sonores
            </ToggleLabel>
          </ToggleContainer>
          
          {errors.notificationSubmit && <ErrorMessage>{errors.notificationSubmit}</ErrorMessage>}
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Mise à jour...' : 'Enregistrer les paramètres'}
          </SubmitButton>
        </form>
      </SettingsCard>
    </SettingsContainer>
  );
};

export default AdminSettings;