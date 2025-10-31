import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

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

const logo = styled(Link)`
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

const Navlinks = styled.div`
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

const Navlink = styled(Link)`
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

const Mobilemenubutton = styled.button`
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

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }
`;

const LogoIcon = styled.span`
  font-size: 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    flex-direction: column;
    padding: 1rem;
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    background-color: rgba(212, 175, 55, 0.1);
    transform: translateY(-2px);
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.secondary};
    background-color: rgba(212, 175, 55, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Création des éléments de navigation avec des noms directs en français
  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'À propos' },
    { path: '/contact', label: 'Contact' },
  ];

  // Ajout du lien admin uniquement si authentifié
  const allNavItems = isAuthenticated 
    ? [...navItems, { path: '/admin/login', label: 'Admin' }]
    : navItems;

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <LogoIcon>🏠</LogoIcon>
          VideMaison
        </Logo>
        
        <NavLinks isOpen={isOpen}>
          {allNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
        
        <NavRight>
          {/* Suppression du LanguageSwitcher */}
          <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </MobileMenuButton>
        </NavRight>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;