import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';

import axios from 'axios';

// Admin Dashboard Components
import RequestsList from '../components/admin/RequestsList';
import RequestDetails from '../components/admin/RequestDetails';

import AdminSettings from '../components/admin/AdminSettings';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  padding-top: 80px; // For navbar
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 2rem 0;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: fixed;
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const SidebarTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarMenuItem = styled.li`
  margin-bottom: 0.5rem;
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: ${({ theme, active }) => active ? theme.colors.secondary : theme.colors.text};
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  i {
    margin-right: 1rem;
    font-size: 1.2rem;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  ${({ active, theme }) => active && `
    background-color: rgba(255, 255, 255, 0.05);
    border-left: 3px solid ${theme.colors.secondary};
  `}
`;

const NotificationBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-left: 8px;
`;

const Content = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

// Add these new styled components for the notification modal
const NotificationModal = styled.div`
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  
  &.show {
    display: block;
  }
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  margin: 15% auto;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 10px;
  width: 50%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    color: ${({ theme }) => theme.colors.secondary};
    margin: 0;
  }
  
  button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
    cursor: pointer;
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const NotificationBubble = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: 100;
  max-width: 350px;
  transform: translateY(200%);
  transition: transform 0.3s ease;
  border-left: 4px solid ${({ theme }) => theme.colors.secondary};
  
  &.show {
    transform: translateY(0);
  }
`;

const AdminDashboardPage = () => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();
  const { socket, connected } = useSocket();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const notificationBubbleRef = useRef(null);
  const audioContextRef = useRef(null);
  
  // Add this function to handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  // Function to show notification bubble
  const showNotification = (data) => {
    if (notificationBubbleRef.current) {
      notificationBubbleRef.current.innerHTML = `
        <strong>${data.name}</strong> requested <strong>${data.service_type}</strong><br>
        📍 ${data.address || 'Address not provided'}<br>
        📞 ${data.phone || 'Phone not provided'}<br>
        📧 ${data.email || 'Email not provided'}
      `;
      
      notificationBubbleRef.current.classList.add('show');
      
      setTimeout(() => {
        notificationBubbleRef.current.classList.remove('show');
      }, 10000);
    }
  };
  
  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Create a simple beep sound
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };
  
  // Function to open modal with request details
  const openRequestModal = (request) => {
    setCurrentRequest(request);
    setModalVisible(true);
    markAsRead(request.id);
  };
  
  // Function to close modal
  const closeModal = () => {
    setModalVisible(false);
  };
  
  // Listen for new requests
  useEffect(() => {
    if (socket && connected) {
      console.log('Setting up new_request listener');
      
      socket.on('new_request', (data) => {
        console.log('New request received:', data);
        showNotification(data);
        playNotificationSound();
      });
      
      return () => {
        socket.off('new_request');
      };
    }
  }, [socket, connected]);
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, user, loading, navigate]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Will redirect in useEffect
  }
  
  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarTitle>Admin Dashboard</SidebarTitle>
       
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarLink to="/admin/dashboard" active={window.location.pathname === '/admin/dashboard'}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLink to="/admin/dashboard/requests" active={window.location.pathname.includes('/admin/dashboard/requests')}>
              <i className="fas fa-clipboard-list"></i> Service Requests
              {unreadCount > 0 && <NotificationBadge />}
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarLink to="/admin/dashboard/settings" active={window.location.pathname.includes('/admin/dashboard/settings')}>
              <i className="fas fa-cog"></i> Settings
            </SidebarLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
  <SidebarLink as="button" onClick={handleLogout} style={{ 
    cursor: 'pointer', 
    width: '100%', 
    textAlign: 'left',
    border: 'none',
    background: 'transparent',
    fontWeight: 'normal'
  }}>
    <i className="fas fa-sign-out-alt"></i> Logout
  </SidebarLink>
</SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
      
      <Content>
        <Routes>
          <Route path="/" element={<AdminDashboardHome />} />
          <Route path="/requests" element={<RequestsList />} />
          <Route path="/requests/:requestId" element={<RequestDetails />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </Content>
      
      {/* Request Detail Modal */}
      <NotificationModal className={modalVisible ? 'show' : ''}>
        <ModalContent>
          <ModalHeader>
            <h2>Request Details</h2>
            <button onClick={closeModal}>×</button>
          </ModalHeader>
          
          {currentRequest && (
            <div>
              <p><strong>Name:</strong> {currentRequest.name}</p>
              <p><strong>Service:</strong> {currentRequest.service_type}</p>
              <p><strong>Email:</strong> {currentRequest.email}</p>
              <p><strong>Phone:</strong> {currentRequest.phone}</p>
              <p><strong>Address:</strong> {currentRequest.address}</p>
              <p><strong>Message:</strong> {currentRequest.message}</p>
              <p><strong>Date:</strong> {new Date(currentRequest.timestamp).toLocaleString()}</p>
              
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Link 
                  to={`/admin/dashboard/requests/${currentRequest.id}`}
                  style={{
                    backgroundColor: '#d4af37',
                    color: '#1a1a1a',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    marginRight: '10px'
                  }}
                  onClick={closeModal}
                >
                  View Details
                </Link>
                <button 
                  onClick={closeModal}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </ModalContent>
      </NotificationModal>
      {/* Notification Bubble */}
      <NotificationBubble ref={notificationBubbleRef} />
    </DashboardContainer>
  );
};

// Dashboard Home Component
const DashboardHomeContainer = styled.div`
  h1 {
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  h3 {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    
    &.positive {
      color: ${({ theme }) => theme.colors.success};
    }
    
    &.negative {
      color: ${({ theme }) => theme.colors.danger};
    }
    
    i {
      margin-right: 0.5rem;
    }
  }
`;

const RecentRequestsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  h2 {
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 1.5rem;
  }
`;

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0,
    totalChange: 0,
    pendingChange: 0,
    completedChange: 0,
    recentRequests: []
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard/stats');
        console.log('Dashboard stats response:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to empty data if API call fails
        setStats({
          totalRequests: 0,
          pendingRequests: 0,
          completedRequests: 0,
          cancelledRequests: 0,
          totalChange: 0,
          pendingChange: 0,
          completedChange: 0,
          recentRequests: []
        });
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <DashboardHomeContainer>
      <h1>Dashboard</h1>
      
      <StatsGrid>
        
        <StatCard>
          <h3>Total Requests</h3>
          <div className="stat-value">{stats.totalRequests}</div>
          <div className="stat-change positive">
            <i className="fas fa-info-circle"></i> 
            All-time total
          </div>
        </StatCard>
        
        <StatCard>
          <h3>Pending Requests</h3>
          <div className="stat-value">{stats.pendingRequests}</div>
          <div className="stat-change positive">
            <i className="fas fa-calendar-day"></i> 
            For today
          </div>
        </StatCard>
        
        <StatCard>
          <h3>Completed Requests</h3>
          <div className="stat-value">{stats.completedRequests}</div>
          <div className="stat-change positive">
            <i className="fas fa-calendar-day"></i> 
            For today
          </div>
        </StatCard>
        
        <StatCard>
          <h3>Cancelled Requests</h3>
          <div className="stat-value">{stats.cancelledRequests || 0}</div>
          <div className="stat-change positive">
            <i className="fas fa-calendar-day"></i> 
            For today
          </div>
        </StatCard>
      </StatsGrid>
      
      <RecentRequestsContainer>
        <h2>Today's Requests</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Service</th>
              <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentRequests && stats.recentRequests.length > 0 ? (
              stats.recentRequests.map(request => (
                <tr key={request.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{request.name}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{request.service_type}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      backgroundColor: 
                        request.status === 'pending' ? 'rgba(255, 193, 7, 0.2)' :
                        request.status === 'in_progress' ? 'rgba(23, 162, 184, 0.2)' :
                        request.status === 'completed' ? 'rgba(40, 167, 69, 0.2)' :
                        request.status === 'cancelled' ? 'rgba(220, 53, 69, 0.2)' :
                        'rgba(108, 117, 125, 0.2)',
                      color: 
                        request.status === 'pending' ? '#ffc107' :
                        request.status === 'in_progress' ? '#17a2b8' :
                        request.status === 'completed' ? '#28a745' :
                        request.status === 'cancelled' ? '#dc3545' :
                        '#6c757d'
                    }}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {request.created_at}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Link to={`/admin/dashboard/requests/${request.id}`} style={{ color: '#d4af37', marginRight: '1rem' }}>
                      <i className="fas fa-eye"></i>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  No recent requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </RecentRequestsContainer>
    </DashboardHomeContainer>
  );
};

export default AdminDashboardPage;