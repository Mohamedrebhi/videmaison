import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, OrbitControls, Float } from '@react-three/drei';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const CardContainer = styled.div`
  width: 300px;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.large};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
  }
`;

const Card3DCanvas = styled.div`
  height: 200px;
  width: 100%;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const CardButton = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }
`;

// 3D Icon Component
function ServiceIcon3D({ type, color = '#d4af37' }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const getIconGeometry = () => {
    switch (type) {
      case 'vide_maison':
        return <Box ref={meshRef} args={[1, 1, 1]}><meshStandardMaterial color={color} /></Box>;
      case 'vide_appartement':
        return <Box ref={meshRef} args={[1.2, 0.8, 1]}><meshStandardMaterial color={color} /></Box>;
      case 'vide_grenier':
        return (
          <group ref={meshRef}>
            <Box args={[1, 0.5, 1]} position={[0, -0.25, 0]}><meshStandardMaterial color={color} /></Box>
            <Box args={[0.8, 0.3, 0.8]} position={[0, 0.4, 0]}><meshStandardMaterial color={color} /></Box>
          </group>
        );
      case 'nettoyage':
        return (
          <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
            <Box ref={meshRef} args={[0.8, 0.8, 0.8]}><meshStandardMaterial color={color} /></Box>
          </Float>
        );
      default:
        return <Box ref={meshRef} args={[1, 1, 1]}><meshStandardMaterial color={color} /></Box>;
    }
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={0.8} />
      {getIconGeometry()}
    </>
  );
}

const ServiceCard3D = ({ service, onRequestService }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card3DCanvas>
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ServiceIcon3D type={service.type} color={isHovered ? '#ff6b6b' : '#d4af37'} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={isHovered} />
        </Canvas>
      </Card3DCanvas>
      
      <CardContent>
        <div>
          <CardTitle>{t(`services.${service.type}.title`)}</CardTitle>
          <CardDescription>{t(`services.${service.type}.description`)}</CardDescription>
        </div>
        <CardButton onClick={() => onRequestService(service.type)}>
          {t('hero.cta')}
        </CardButton>
      </CardContent>
    </CardContainer>
  );
};

export default ServiceCard3D;