import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

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
      title: 'Vide Maison', 
      image: '/images/maison.jpg',
      description: (
        <>
          <p>Notre service de vide maison est conçu pour vous débarrasser de tous les objets dont vous ne voulez plus, que ce soit suite à une succession, un déménagement ou simplement pour faire de la place.</p>
          <p>Nous intervenons rapidement et efficacement pour :</p>
          <ul>
            <li>Évaluer gratuitement le contenu à débarrasser</li>
            <li>Trier les objets selon leur valeur et leur état</li>
            <li>Démonter les meubles si nécessaire</li>
            <li>Évacuer tous les objets et déchets</li>
            <li>Gérer le recyclage et la valorisation des déchets</li>
          </ul>
          <p>Notre équipe professionnelle travaille avec respect et discrétion, en veillant à préserver votre propriété pendant l'intervention.</p>
        </>
      )
    },
    {
      id: 'vide-appartement',
      title: 'Vide Appartement',
      image: '/images/appartement.jpg',
      description: (
        <>
          <p>Notre service de vide appartement est parfaitement adapté aux espaces plus restreints et aux contraintes spécifiques des immeubles (ascenseurs, escaliers, etc.).</p>
          <p>Nous proposons :</p>
          <ul>
            <li>Une intervention rapide, idéale pour les fins de bail</li>
            <li>Une équipe expérimentée dans les débarras d'appartements</li>
            <li>Des solutions adaptées aux contraintes d'accès</li>
            <li>Un service complet incluant le démontage si nécessaire</li>
            <li>Une gestion éco-responsable des déchets</li>
          </ul>
          <p>Nous garantissons un service discret et efficace, respectueux de votre voisinage et des parties communes de l'immeuble.</p>
        </>
      )
    },
    {
      id: 'vide-grenier',
      title: 'Vide Grenier',
      image: '/images/grenier.jpg',
      description: (
        <>
          <p>Notre service de vide grenier vous aide à libérer vos combles et espaces de stockage encombrés, souvent difficiles d’accès.</p>
          <p>Avec nous, vous bénéficiez de :</p>
          <ul>
            <li>Un tri précis des objets conservables, recyclables ou jetables</li>
            <li>Une gestion des objets lourds et encombrants</li>
            <li>Un accès sécurisé même dans les zones étroites</li>
            <li>Un traitement éco-responsable des déchets</li>
          </ul>
          <p>Nous veillons à ce que votre grenier retrouve tout son espace, prêt pour de nouveaux projets.</p>
        </>
      )
    },
    {
      id: 'vide-locaux',
      title: 'Vide Locaux Professionnels',
      image: '/images/LocauxProfessionnels.jpg',
      description: (
        <>
          <p>Nous accompagnons les entreprises et professionnels dans le débarras de leurs locaux, ateliers, commerces ou entrepôts.</p>
          <p>Notre service inclut :</p>
          <ul>
            <li>L'évacuation rapide du mobilier et matériel obsolète</li>
            <li>Le démontage et la manutention lourde</li>
            <li>Un respect strict des normes de sécurité</li>
            <li>Un recyclage et traitement adapté aux déchets professionnels</li>
          </ul>
          <p>Nous intervenons dans des délais courts pour limiter l’impact sur votre activité.</p>
        </>
      )
    },
    {
      id: 'vide-bureau',
      title: 'Vide Bureau',
      image: '/images/bureau.jpg',
      description: (
        <>
          <p>Notre service de vide bureau est destiné aux entreprises souhaitant libérer ou réaménager leurs espaces de travail.</p>
          <p>Nous proposons :</p>
          <ul>
            <li>Le débarras de mobilier de bureau (chaises, tables, armoires...)</li>
            <li>La récupération et valorisation du matériel informatique</li>
            <li>Un tri sélectif et une gestion responsable des déchets</li>
            <li>Une intervention discrète et organisée</li>
          </ul>
          <p>Nous vous aidons à optimiser vos espaces tout en respectant vos contraintes de planning.</p>
        </>
      )
    },
    {
      id: 'nettoyage',
      title: 'Nettoyage',
      image: '/images/nettoyage.jpg',
      description: (
        <>
          <p>En complément du débarras, nous proposons des prestations de nettoyage pour rendre vos espaces parfaitement propres et prêts à l’usage.</p>
          <p>Nos prestations incluent :</p>
          <ul>
            <li>Le nettoyage complet des sols et surfaces</li>
            <li>La désinfection des espaces sensibles</li>
            <li>Le dépoussiérage et lavage des vitres</li>
            <li>Des produits respectueux de l’environnement</li>
          </ul>
          <p>Nous adaptons notre intervention à vos besoins spécifiques pour un résultat impeccable.</p>
        </>
      )
    }
    
    // Add remaining services
  ];
  
  return (
    <PageContainer>
      <HeroSection>
        <div>
          <HeroTitle>
            Nos <span>Services</span>
          </HeroTitle>
          <HeroSubtitle>
            Découvrez notre gamme complète de services de débarras et nettoyage, adaptés à tous vos besoins.
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