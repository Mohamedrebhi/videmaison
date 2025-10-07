import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../../utils/axiosConfig';
import { useNotification } from '../../context/NotificationContext';

const RequestsContainer = styled.div`
  h1 {
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const FilterSelect = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  margin-left: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const RequestsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const TableHead = styled.thead`
  background-color: rgba(0, 0, 0, 0.2);
  
  th {
    padding: 1.2rem 1rem;
    text-align: left;
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: 600;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }
  }
  
  td {
    padding: 1.2rem 1rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
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

const ViewButton = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 1rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

// Change this


// To this
const PageButton = styled.button`
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.secondary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.text};
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.secondary : 'rgba(255, 255, 255, 0.1)'};
  padding: 0.5rem 1rem;
  margin: 0 0.3rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.secondary : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { markAsRead } = useNotification();
  
  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter]);
  
  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Real API call with pagination and filtering
      const response = await axios.get('/api/admin/requests', {
        params: {
          page: currentPage,
          status: statusFilter || undefined
        }
      });
      
      setRequests(response.data.requests || []);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      // Fallback to empty data if API call fails
      setRequests([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === '' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <RequestsContainer>
      <h1>Demandes de Service</h1>
      
      <FiltersContainer>
        <SearchInput 
          type="text" 
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <div>
          <FilterSelect 
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </FilterSelect>
        </div>
      </FiltersContainer>
      
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <RequestsTable>
            <TableHead>
              <tr>
                <th>Nom</th>
                <th>Service</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {filteredRequests.map(request => (
                <tr key={request._id}>
                  <td>{request.name}</td>
                  <td>{getServiceTypeName(request.service_type)}</td>
                  <td>{formatDate(request.created_at)}</td>
                  <td>
                    <StatusBadge status={request.status}>
                      {request.status === 'pending' ? 'En attente' :
                       request.status === 'in_progress' ? 'En cours' :
                       request.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </StatusBadge>
                  </td>
                  <td>
                    <ViewButton 
                      to={`/admin/dashboard/requests/${request._id}`}
                      onClick={() => markAsRead(request._id)}
                    >
                      <i className="fas fa-eye"></i> Voir
                    </ViewButton>
                  </td>
                </tr>
              ))}
            </TableBody>
          </RequestsTable>
          
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PageButton
                key={page}
                $active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PageButton>
            ))}
          </Pagination>
        </>
      )}
    </RequestsContainer>
  );
};

export default RequestsList;