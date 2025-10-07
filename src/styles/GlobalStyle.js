import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#1a1a1a',
    secondary: '#d4af37', // Gold
    accent: '#8a6d3b',
    background: '#0f0f0f',
    text: '#ffffff',
    textSecondary: '#cccccc',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  },
  fonts: {
    main: '"Playfair Display", serif',
    secondary: '"Montserrat", sans-serif'
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    largeDesktop: '1200px'
  },
  transitions: {
    standard: '0.3s ease-in-out'
  },
  shadows: {
    small: '0 2px 5px rgba(0, 0, 0, 0.2)',
    medium: '0 5px 15px rgba(0, 0, 0, 0.3)',
    large: '0 10px 25px rgba(0, 0, 0, 0.5)'
  }
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: ${({ theme }) => theme.fonts.secondary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    line-height: 1.5;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.main};
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  h1 {
    font-size: 3.5rem;
    line-height: 1.2;
  }
  
  h2 {
    font-size: 2.5rem;
    line-height: 1.3;
  }
  
  h3 {
    font-size: 2rem;
    line-height: 1.4;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.standard};
    
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
  
  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.secondary};
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .section {
    padding: 5rem 0;
  }
  
  .text-center {
    text-align: center;
  }
  
  .gold-text {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;