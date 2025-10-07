import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../../utils/axiosConfig';

const DetailsContainer = styled.div`
  h1 {
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const BackButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0;
  
  i {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DetailsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  margin-bottom: 2rem;
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    color: ${({ theme }) => theme.colors.secondary};
    margin: 0;
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${({ status, theme }) => 
    status === 'pending' ? 'rgba(255, 193, 7, 0.2)' :
    status === 'in_progress' ? 'rgba(23, 162, 184, 0.2)' :
    status === 'completed' ? 'rgba(40, 167, 69, 0.2)' :
    'rgba(220, 53, 69, 0.2)'};
  color: ${({ status, theme }) => 
    status === 'pending' ? '#ffc107' :
    status === 'in_progress' ? '#17a2b8' :
    status === 'completed' ? '#28a745' :
    '#dc3545'};
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const DetailsSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.1rem;
  }
`;

const MessageBox = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  padding: 1.5rem;
  margin-top: 1rem;
  white-space: pre-line;
`;

const ActionsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ActionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1.5rem;
`;

const StatusSelect = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.secondary};
  transition: border-color 0.3s ease;
  appearance: none;
   background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right 1rem center;
  
  width: 100%;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    
  }
     option {
    background-color: #1a1a1a; /* Dark background for options */
    color: white; /* White text for better visibility */
    padding: 10px; /* Add padding to options */
  }
`;

const NotesTextarea = styled.textarea`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  min-height: 150px;
  margin-bottom: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};

  }
`;

const UpdateButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const RequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);
  
  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      // Real API call to get request details
      const response = await axios.get(`/api/admin/requests/${requestId}`);
      const requestData = response.data;
      
      setRequest(requestData);
      setStatus(requestData.status);
      setAdminNotes(requestData.admin_notes || '');
    } catch (error) {
      console.error('Failed to fetch request details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  
  const handleNotesChange = (e) => {
    setAdminNotes(e.target.value);
  };
  
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      // Real API call to update request status and notes
      await axios.put(`/api/admin/requests/${requestId}/status`, {
        status,
        admin_notes: adminNotes
      });
      
      // Update local state with new values
      setRequest(prev => ({
        ...prev,
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      }));
      
      // Show success notification
      // You can add a notification system here
    } catch (error) {
      console.error('Failed to update request:', error);
      // Show error notification
    } finally {
      setUpdating(false);
    }
  };
  
  const getServiceTypeName = (type) => {
    const serviceTypes = {
      vide_maison: 'Vide Maison',
      vide_appartement: 'Vide Appartement',
      vide_grenier: 'Vide Grenier',
      vide_locaux: 'Vide Locaux Professionnels',
      vide_bureau: 'Vide Bureau',
      nettoyage: 'Nettoyage'
    };
    
    return serviceTypes[type] || type;
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!request) {
    return <div>Demande non trouvée</div>;
  }
  
  return (
    <DetailsContainer>
      <BackButton onClick={() => navigate('/admin/dashboard/requests')}>
        <i className="fas fa-arrow-left"></i> Retour à la liste
      </BackButton>
      
      <h1>Détails de la Demande</h1>
      
      <DetailsCard>
        <DetailsHeader>
          <h2>Demande #{request.id}</h2>
          <StatusBadge status={request.status}>
            {request.status === 'pending' && 'En attente'}
            {request.status === 'in_progress' && 'En cours'}
            {request.status === 'completed' && 'Terminé'}
            {request.status === 'cancelled' && 'Annulé'}
          </StatusBadge>
        </DetailsHeader>
        
        <DetailsGrid>
          <DetailsSection>
            <h3>Informations Client</h3>
            
            <DetailItem>
              <label>Nom</label>
              <p>{request.name}</p>
            </DetailItem>
            
            <DetailItem>
              <label>Email</label>
              <p>{request.email}</p>
            </DetailItem>
            
            <DetailItem>
              <label>Téléphone</label>
              <p>{request.phone}</p>
            </DetailItem>
            
            <DetailItem>
              <label>Adresse</label>
              <p>{request.address}</p>
            </DetailItem>
          </DetailsSection>
          
          <DetailsSection>
            <h3>Détails de la Demande</h3>
            
            <DetailItem>
              <label>Type de Service</label>
              <p>{getServiceTypeName(request.service_type)}</p>
            </DetailItem>
            
            <DetailItem>
              <label>Date de Création</label>
              <p>{formatDate(request.created_at)}</p>
            </DetailItem>
            
            <DetailItem>
              <label>Dernière Mise à Jour</label>
              <p>{formatDate(request.updated_at)}</p>
            </DetailItem>
            
            <DetailItem>
              <label>Message du Client</label>
              <MessageBox>{request.message}</MessageBox>
            </DetailItem>
          </DetailsSection>
        </DetailsGrid>
      </DetailsCard>
      
      <ActionsCard>
        <ActionTitle>Mettre à Jour la Demande</ActionTitle>
        
        <StatusSelect value={status} onChange={handleStatusChange}>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </StatusSelect>
        
        <NotesTextarea 
          placeholder="Notes administratives (visibles uniquement par les administrateurs)"
          value={adminNotes}
          onChange={handleNotesChange}
        />
        
        <UpdateButton onClick={handleUpdate} disabled={updating}>
          {updating ? 'Mise à jour...' : 'Mettre à jour'}
        </UpdateButton>
      </ActionsCard>
    </DetailsContainer>
  );
};

export default RequestDetails;