import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PageContainer = styled.div`
  padding-top: 80px; // For navbar
`;

const HeroSection = styled.section`
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/services-hero.jpg');
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  
  span {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ServicesSection = styled.section`
  padding: 5rem 0;
`;

const ServiceContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 5rem;
  padding: 0 2rem;
  display: flex;
  flex-direction: ${({ reverse }) => reverse ? 'row-reverse' : 'row'};
  gap: 3rem;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const ServiceImage = styled.div`
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ServiceContent = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ServiceDescription = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.8;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const ServicesPage = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Scroll to service section if hash is present
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  const services = [
    {
      id: 'vide-maison',
      title: 'Vide Maison', // Titre en français
      image: '/images/maison.jpg',
      description: (
        <>
          <p>Nous offrons un service complet de débarras de maison pour toutes les situations.</p>
          <p>Notre service de vide maison comprend :</p>
          <ul>
            <>
              <li>Vidage complet de maisons de toutes tailles</li>
              <li>Tri et élimination éco-responsable des objets</li>
              <li>Démontage de meubles si nécessaire</li>
              <li>Manipulation soigneuse des objets de valeur</li>
              <li>Service rapide et efficace</li>
            </>
          </ul>
          <p>Contactez-nous pour un devis gratuit adapté à vos besoins.</p>
        </>
      )
    },
    {
      id: 'vide-appartement',
      title: 'Vide Appartement', // Titre en français
      image: '/images/appartement.jpg',
      description: (
        <>
          <p>Notre service de débarras d'appartement est parfait pour les déménagements ou les fins de bail.</p>
          <p>Nous fournissons un débarras d'appartement professionnel avec :</p>
          <ul>
            <>
              <li>Intervention rapide, idéale pour les fins de bail</li>
              <li>Une équipe expérimentée dans le débarras d'appartements</li>
              <li>Solutions adaptées aux contraintes d'accès</li>
              <li>Un service complet incluant le démontage si nécessaire</li>
              <li>Gestion éco-responsable des déchets</li>
            </>
          </ul>
          <p>Nous garantissons une expérience sans stress pour tous vos besoins de débarras d'appartement.</p>
        </>
      )
    },
    {
      id: 'vide-grenier',
      title: 'Vide Grenier', // Titre en français
      image: '/images/grenier.jpg',
      description: (
        <>
          <p>Nous sommes spécialisés dans le débarras de greniers et d'espaces sous combles encombrés.</p>
          <p>Notre service de vide grenier comprend :</p>
          <ul>
            <>
              <li>Enlèvement sécurisé d'objets dans des espaces difficiles d'accès</li>
              <li>Élimination appropriée des anciennes isolations et matériaux</li>
              <li>Manipulation soigneuse d'objets vintage potentiellement précieux</li>
              <li>Nettoyage complet après débarras</li>
              <li>Gestion des déchets respectueuse de l'environnement</li>
            </>
          </ul>
          <p>Transformez votre grenier encombré en espace utilisable avec notre service professionnel.</p>
        </>
      )
    },
    {
      id: 'vide-locaux',
      title: 'Vide Locaux Professionnels', // Titre en français
      image: '/images/LocauxProfessionnels.jpg',
      description: (
        <>
          <p>Nous fournissons des services de débarras efficaces pour tous types de locaux commerciaux.</p>
          <p>Notre service de débarras commercial offre :</p>
          <ul>
            <>
              <li>Débarras complet de bureaux, magasins et entrepôts</li>
              <li>Élimination sécurisée de documents confidentiels</li>
              <li>Enlèvement et recyclage d'équipements électroniques</li>
              <li>Planification flexible pour minimiser les perturbations commerciales</li>
              <li>Manipulation professionnelle des installations et aménagements commerciaux</li>
            </>
          </ul>
          <p>Nous aidons les entreprises à effectuer une transition en douceur vers de nouveaux locaux ou à préparer des espaces pour de nouveaux locataires.</p>
        </>
      )
    },
    {
      id: 'vide-cave',
      title: 'Vide Cave', // Changement de vide-bureau à vide-cave
      image: '/images/bureau.jpg', // Utilisation de l'image existante
      description: (
        <>
          <p>Notre service de débarras de cave vous aide à récupérer cet espace de stockage précieux.</p>
          <p>Nous offrons un débarras de cave complet comprenant :</p>
          <ul>
            <>
              <li>Enlèvement d'objets lourds et encombrants</li>
              <li>Traitement des problèmes d'humidité et de moisissure</li>
              <li>Tri et recyclage des matériaux</li>
              <li>Service disponible le week-end et en soirée</li>
              <li>Manipulation professionnelle dans des espaces confinés</li>
            </>
          </ul>
          <p>Laissez-nous gérer votre cave encombrée pour créer un espace de stockage propre et fonctionnel.</p>
        </>
      )
    },
    {
      id: 'nettoyage',
      title: 'Services de Nettoyage', // Titre en français
      image: '/images/nettoyage.jpg',
      description: (
        <>
          <p>Nous fournissons des services de nettoyage complets après débarras ou pour un entretien régulier.</p>
          <p>Nos services de nettoyage comprennent :</p>
          <ul>
            <>
              <li>Nettoyage en profondeur de toutes les surfaces</li>
              <li>Nettoyage des vitres et des surfaces vitrées</li>
              <li>Nettoyage des tapis et des meubles rembourrés</li>
              <li>Nettoyage de fin de bail</li>
              <li>Produits de nettoyage écologiques disponibles</li>
            </>
          </ul>
          <p>Laissez votre espace impeccable avec nos services de nettoyage professionnels.</p>
        </>
      )
    }
  ];
  
  return (
    <PageContainer>
      <HeroSection>
        <div>
          <HeroTitle>Nos <span>Services</span></HeroTitle>
          <HeroSubtitle>
            Services professionnels de débarras et de nettoyage pour tous vos besoins
          </HeroSubtitle>
        </div>
      </HeroSection>
      
      <ServicesSection>
        {services.map((service, index) => (
          <ServiceContainer 
            key={service.id} 
            id={service.id}
            reverse={index % 2 !== 0}
          >
            <ServiceImage>
              <img src={service.image} alt={service.title} />
            </ServiceImage>
            <ServiceContent>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceContent>
          </ServiceContainer>
        ))}
      </ServicesSection>
    </PageContainer>
  );
};

export default ServicesPage;