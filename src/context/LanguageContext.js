import React, { createContext, useContext, useState, useEffect } from 'react';

// Create language context
const LanguageContext = createContext();

// Define translations for all UI text
const translations = {
  en: {
    // Navbar
    home: 'Home',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    dashboard: 'Dashboard',
    
    // Hero section
    heroTitle: 'Professional House Clearance Service',
    heroSubtitle: 'We operate throughout Brussels and surrounding areas to offer you a quality, fast and efficient service.',
    discoverServices: 'Discover our services',
    
    // Services section
    ourServices: 'Our',
    services: 'Services',
    learnMore: 'Learn more',
    
    // Service types
    videMaison: 'House Clearance',
    videAppartement: 'Apartment Clearance',
    videGrenier: 'Attic Clearance',
    videLocaux: 'Commercial Premises Clearance',
    videCave: 'Basement Clearance',
    nettoyage: 'Cleaning',
    
    // Service descriptions
    videMaisonDesc: 'Complete house clearance service with free estimation and eco-friendly waste management.',
    videAppartementDesc: 'Fast and efficient apartment clearance, ideal for rentals or inheritances.',
    videGrenierDesc: 'Attic cleaning and clearance, with sorting and valuation of valuable items.',
    videLocauxDesc: 'Clearance service for businesses, shops and offices with rapid intervention.',
    videCaveDesc: 'Relocation and clearance of basements with recycling of furniture and IT equipment.',
    nettoyageDesc: 'Professional cleaning service after clearance for impeccable restoration.',
    
    // Contact form
    contactUs: 'Contact',
    us: 'Us',
    serviceRequest: 'Service Request',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    serviceType: 'Service Type',
    selectService: 'Select a service',
    message: 'Message',
    sending: 'Sending...',
    send: 'Send request',
    successMessage: 'Your request has been sent successfully! We will contact you soon.',
    
    // Form validations
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    invalidEmail: 'Invalid email format',
    phoneRequired: 'Phone is required',
    addressRequired: 'Address is required',
    serviceRequired: 'Please select a service type',
    messageRequired: 'Message is required',
    errorSubmitting: 'An error occurred. Please try again later.',
    
    // Footer
    companyDescription: 'Our company is as close to perfection as it gets when it comes to offering house clearance, attic clearance, apartment clearance services, etc.',
    usefulLinks: 'Useful Links',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    allRightsReserved: 'All rights reserved.'
  },
  fr: {
    // Navbar
    home: 'Accueil',
    services: 'Services',
    about: 'À Propos',
    contact: 'Contact',
    dashboard: 'Dashboard',
    
    // Hero section
    heroTitle: 'Service de Vide Maison Professionnel',
    heroSubtitle: 'Nous intervenons dans toute la commune de Bruxelles et dans les environs pour vous offrir un service de qualité, rapide et efficace.',
    discoverServices: 'Découvrir nos services',
    
    // Services section
    ourServices: 'Nos',
    services: 'Services',
    learnMore: 'En savoir plus',
    
    // Service types
    videMaison: 'Vide Maison',
    videAppartement: 'Vide Appartement',
    videGrenier: 'Vide Grenier',
    videLocaux: 'Vide Locaux Professionnels',
    videCave: 'Vide Cave',
    nettoyage: 'Nettoyage',
    
    // Service descriptions
    videMaisonDesc: 'Service complet de débarras de maison avec estimation gratuite et gestion éco-responsable des déchets.',
    videAppartementDesc: 'Débarras d\'appartement rapide et efficace, idéal pour les locations ou successions.',
    videGrenierDesc: 'Nettoyage et débarras de greniers, avec tri et valorisation des objets de valeur.',
    videLocauxDesc: 'Service de débarras pour entreprises, commerces et bureaux avec intervention rapide.',
    videCaveDesc: 'Déménagement et débarras de caves avec recyclage du mobilier et matériel.',
    nettoyageDesc: 'Service de nettoyage professionnel après débarras pour une remise en état impeccable.',
    
    // Contact form
    contactUs: 'Contactez',
    us: 'Nous',
    serviceRequest: 'Demande de Service',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    serviceType: 'Type de Service',
    selectService: 'Sélectionnez un service',
    message: 'Message',
    sending: 'Envoi en cours...',
    send: 'Envoyer la demande',
    successMessage: 'Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.',
    
    // Form validations
    nameRequired: 'Le nom est requis',
    emailRequired: 'L\'email est requis',
    invalidEmail: 'Format d\'email invalide',
    phoneRequired: 'Le téléphone est requis',
    addressRequired: 'L\'adresse est requise',
    serviceRequired: 'Veuillez sélectionner un type de service',
    messageRequired: 'Le message est requis',
    errorSubmitting: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    
    // Footer
    companyDescription: 'Notre société est ce qui se rapproche de la perfection en matière de proposition de services de vide maison, de vide grenier, de vide appartement, etc.',
    usefulLinks: 'Liens Utiles',
    termsOfUse: 'Conditions d\'utilisation',
    privacyPolicy: 'Politique de confidentialité',
    allRightsReserved: 'Tous droits réservés.'
  },
  nl: {
    // Navbar
    home: 'Home',
    services: 'Diensten',
    about: 'Over Ons',
    contact: 'Contact',
    dashboard: 'Dashboard',
    
    // Hero section
    heroTitle: 'Professionele Huisontruimingsdienst',
    heroSubtitle: 'Wij werken in heel Brussel en omgeving om u een kwaliteitsvolle, snelle en efficiënte service te bieden.',
    discoverServices: 'Ontdek onze diensten',
    
    // Services section
    ourServices: 'Onze',
    services: 'Diensten',
    learnMore: 'Meer informatie',
    
    // Service types
    videMaison: 'Huisontruiming',
    videAppartement: 'Appartementontruiming',
    videGrenier: 'Zolderontruiming',
    videLocaux: 'Bedrijfsruimte Ontruiming',
    videCave: 'Kelderontruiming',
    nettoyage: 'Schoonmaak',
    
    // Service descriptions
    videMaisonDesc: 'Complete huisontruimingsdienst met gratis schatting en milieuvriendelijk afvalbeheer.',
    videAppartementDesc: 'Snelle en efficiënte appartementontruiming, ideaal voor verhuur of erfenissen.',
    videGrenierDesc: 'Zolderopruiming en -ontruiming, met sortering en taxatie van waardevolle items.',
    videLocauxDesc: 'Ontruimingsdienst voor bedrijven, winkels en kantoren met snelle interventie.',
    videCaveDesc: 'Verhuizing en ontruiming van kelders met recycling van meubilair en IT-apparatuur.',
    nettoyageDesc: 'Professionele schoonmaakdienst na ontruiming voor een onberispelijke staat.',
    
    // Contact form
    contactUs: 'Neem',
    us: 'Contact Op',
    serviceRequest: 'Dienstverzoek',
    name: 'Naam',
    email: 'E-mail',
    phone: 'Telefoon',
    address: 'Adres',
    serviceType: 'Type Dienst',
    selectService: 'Selecteer een dienst',
    message: 'Bericht',
    sending: 'Verzenden...',
    send: 'Verzoek verzenden',
    successMessage: 'Uw verzoek is succesvol verzonden! We nemen binnenkort contact met u op.',
    
    // Form validations
    nameRequired: 'Naam is vereist',
    emailRequired: 'E-mail is vereist',
    invalidEmail: 'Ongeldig e-mailformaat',
    phoneRequired: 'Telefoon is vereist',
    addressRequired: 'Adres is vereist',
    serviceRequired: 'Selecteer een type dienst',
    messageRequired: 'Bericht is vereist',
    errorSubmitting: 'Er is een fout opgetreden. Probeer het later opnieuw.',
    
    // Footer
    companyDescription: 'Ons bedrijf komt zo dicht mogelijk bij perfectie als het gaat om het aanbieden van huisontruiming, zolderontruiming, appartementontruiming, enz.',
    usefulLinks: 'Nuttige Links',
    termsOfUse: 'Gebruiksvoorwaarden',
    privacyPolicy: 'Privacybeleid',
    allRightsReserved: 'Alle rechten voorbehouden.'
  }
};

// Create provider component
export const LanguageProvider = ({ children }) => {
  // Get browser language or use French as default
  const getBrowserLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return ['fr', 'en', 'nl'].includes(browserLang) ? browserLang : 'fr';
  };

  // Initialize state with browser language or stored preference
  const [language, setLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem('language');
    return storedLanguage || getBrowserLanguage();
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Get translation function
  const t = (key) => {
    return translations[language][key] || key;
  };

  // Value to be provided to consumers
  const value = {
    language,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Add these translations to the existing translations object

// For English (en)
adminDashboard: 'Admin Dashboard',
dashboard: 'Dashboard',
serviceRequests: 'Service Requests',
settings: 'Settings',
logout: 'Logout',
requestDetails: 'Request Details',
viewDetails: 'View Details',
close: 'Close',
totalRequests: 'Total Requests',
pendingRequests: 'Pending Requests',
completedRequests: 'Completed Requests',
cancelledRequests: 'Cancelled Requests',
allServices: 'All services',
forToday: 'For today',
todaysRequests: "Today's Requests",
status: 'Status',
actions: 'Actions',
noRecentRequests: 'No recent requests found',
requested: 'requested',
requestService: 'requested service',
addressNotProvided: 'Address not provided',
phoneNotProvided: 'Phone not provided',
emailNotProvided: 'Email not provided',
pending: 'Pending',
in_progress: 'In Progress',
completed: 'Completed',
cancelled: 'Cancelled',

// For French (fr)
adminDashboard: 'Tableau de Bord Admin',
dashboard: 'Tableau de Bord',
serviceRequests: 'Demandes de Service',
settings: 'Paramètres',
logout: 'Déconnexion',
requestDetails: 'Détails de la Demande',
viewDetails: 'Voir Détails',
close: 'Fermer',
totalRequests: 'Demandes Totales',
pendingRequests: 'Demandes en Attente',
completedRequests: 'Demandes Terminées',
cancelledRequests: 'Demandes Annulées',
allServices: 'Tous les services',
forToday: "Pour aujourd'hui",
todaysRequests: "Demandes d'Aujourd'hui",
status: 'Statut',
actions: 'Actions',
noRecentRequests: 'Aucune demande récente trouvée',
requestService: 'a demandé le service',
addressNotProvided: 'Adresse non fournie',
phoneNotProvided: 'Téléphone non fourni',
emailNotProvided: 'Email non fourni',
pending: 'En Attente',
in_progress: 'En Cours',
completed: 'Terminé',
cancelled: 'Annulé',

// For Dutch (nl)
adminDashboard: 'Admin Dashboard',
dashboard: 'Dashboard',
serviceRequests: 'Serviceverzoeken',
settings: 'Instellingen',
logout: 'Uitloggen',
requestDetails: 'Verzoekdetails',
viewDetails: 'Details Bekijken',
close: 'Sluiten',
totalRequests: 'Totale Verzoeken',
pendingRequests: 'Wachtende Verzoeken',
completedRequests: 'Voltooide Verzoeken',
cancelledRequests: 'Geannuleerde Verzoeken',
allServices: 'Alle diensten',
forToday: 'Voor vandaag',
todaysRequests: 'Verzoeken van Vandaag',
status: 'Status',
actions: 'Acties',
noRecentRequests: 'Geen recente verzoeken gevonden',
requestService: 'heeft dienst aangevraagd',
addressNotProvided: 'Adres niet opgegeven',
phoneNotProvided: 'Telefoon niet opgegeven',
emailNotProvided: 'E-mail niet opgegeven',
pending: 'In Afwachting',
in_progress: 'In Behandeling',
completed: 'Voltooid',
cancelled: 'Geannuleerd',