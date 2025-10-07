import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const HeroContainer = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const HeroContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  text-align: center;
  z-index: 10;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%);
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  
  span {
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 3rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 800px;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.2rem;
  }
`;

const HeroButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-3px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// 3D Model component
function LuxuryInterior() {
  // Note: In a real implementation, you would need to provide an actual GLTF model
  // For this example, we'll use a placeholder cube
  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

const Hero3D = ({ scrollToServices }) => {
  const { t } = useLanguage();
  
  return (
    <HeroContainer>
      <CanvasContainer>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <PresentationControls
            global
            zoom={0.8}
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <LuxuryInterior />
          </PresentationControls>
          <Environment preset="city" />
        </Canvas>
      </CanvasContainer>
      
      <HeroContent>
        <HeroTitle>
          {t('heroTitle')}
        </HeroTitle>
        <HeroSubtitle>
          {t('heroSubtitle')}
        </HeroSubtitle>
        <HeroButton onClick={scrollToServices}>
          {t('discoverServices')}
        </HeroButton>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero3D;