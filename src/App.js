import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/GlobalStyle';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatProvider } from './context/ChatContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LanguageProvider>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <ChatProvider>
                <Router>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin/dashboard/*" element={<AdminDashboardPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  <Footer />
                </Router>
              </ChatProvider>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
