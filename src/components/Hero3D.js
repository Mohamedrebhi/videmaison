import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text3D, 
  Center, 
  Float, 
  Environment,
  MeshDistortMaterial,
  Sphere,
  Box,
  Cylinder,
  useTexture,
  Html,
  Text
} from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';

// Animated House Model
function AnimatedHouse({ position = [0, 0, 0] }) {
  const houseRef = useRef();
  const roofRef = useRef();
  
  useFrame((state) => {
    if (houseRef.current) {
      houseRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (roofRef.current) {
      roofRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1.5;
    }
  });

  return (
    <group position={position} ref={houseRef}>
      {/* House Base */}
      <Box args={[2, 1.5, 2]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Roof */}
      <Cylinder 
        ref={roofRef}
        args={[0, 1.5, 1, 4]} 
        position={[0, 1.5, 0]} 
        rotation={[0, Math.PI / 4, 0]}
      >
        <meshStandardMaterial color="#DC143C" />
      </Cylinder>
      
      {/* Door */}
      <Box args={[0.3, 0.8, 0.05]} position={[0, 0.4, 1.025]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      {/* Windows */}
      <Box args={[0.4, 0.4, 0.05]} position={[-0.6, 0.8, 1.025]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box args={[0.4, 0.4, 0.05]} position={[0.6, 0.8, 1.025]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
    </group>
  );
}

// Floating Particles
function FloatingParticles() {
  const particlesRef = useRef();
  const particleCount = 50;
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ],
        scale: Math.random() * 0.5 + 0.1
      });
    }
    return temp;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <Float
          key={index}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <Sphere args={[particle.scale]} position={particle.position}>
            <MeshDistortMaterial
              color="#d4af37"
              transparent
              opacity={0.6}
              distort={0.3}
              speed={2}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

// 3D Text Component with Error Handling
function Hero3DText() {
  const { t } = useTranslation();
  
  // Use Text as fallback if Text3D fails
  return (
    <Center>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Suspense fallback={
          <Text 
            color="#d4af37"
            fontSize={0.8}
            position={[0, 2, 0]}
            font="Arial"
          >
            VideMaison
          </Text>
        }>
          <Text3D
            font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
            size={0.8}
            height={0.1}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            position={[0, 2, 0]}
          >
            VideMaison
            <meshStandardMaterial color="#d4af37" />
          </Text3D>
        </Suspense>
      </Float>
    </Center>
  );
}

// Main 3D Scene with Error Boundary
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, 10, 5]} intensity={0.5} />
      
      <Environment preset="sunset" />
      
      <Hero3DText />
      <AnimatedHouse position={[0, -1, 0]} />
      <FloatingParticles />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: 'linear-gradient(to bottom, #87CEEB, #98FB98)',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>VideMaison</h2>
            <p>Your Trusted Partner for House Clearance Services</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main Hero3D Component
const Hero3D = ({ scrollToServices, height = '60vh' }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 60 }}
          style={{ background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color('#87CEEB'));
            // Lower pixel ratio for better performance
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }}
        >
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
        
        {/* Add a learn more button */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}>
          <button 
            onClick={scrollToServices}
            style={{
              backgroundColor: '#d4af37',
              color: '#1a1a1a',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e5c158'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d4af37'}
          >
            En savoir plus
          </button>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Hero3D;