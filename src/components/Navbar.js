import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${({ theme, scrolled }) => 
    scrolled ? theme.colors.primary : 'transparent'};
  padding: 1rem 0;
  transition: background-color 0.3s ease, padding 0.3s ease;
  box-shadow: ${({ scrolled, theme }) => 
    scrolled ? theme.shadows.medium : 'none'};
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 1rem 0;
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, active }) => 
    active ? theme.colors.secondary : theme.colors.text};
  margin: 0 1.5rem;
  font-weight: 500;
  position: relative;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${({ active }) => (active ? '100%' : '0')};
    height: 2px;
    background-color: ${({ theme }) => theme.colors.secondary};
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    
    &:after {
      width: 100%;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 1rem 0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <NavbarContainer scrolled={scrolled}>
      <NavbarContent>
        <Logo to="/">
          Vide<span>Maison</span>
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        <NavLinks isOpen={isOpen}>
          <NavLink to="/" active={location.pathname === '/'}>
            {t('home')}
          </NavLink>
          <NavLink to="/services" active={location.pathname === '/services'}>
            {t('services')}
          </NavLink>
          <NavLink to="/about" active={location.pathname === '/about'}>
            {t('about')}
          </NavLink>
          <NavLink to="/contact" active={location.pathname === '/contact'}>
            {t('contact')}
          </NavLink>
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink to="/admin/dashboard" active={location.pathname.includes('/admin/dashboard')}>
              {t('dashboard')}
            </NavLink>
          )}
          <LanguageSelector />
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;