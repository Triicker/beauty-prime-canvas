import type { Dict } from "./pt";

export const fr: Dict = {
  nav: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    booking: "Réservation",
    shop: "Boutique",
    gallery: "Galerie",
    contact: "Contact",
    pros: "Professionnels",
    faq: "FAQ",
    bookCta: "Réserver une visite",
  },
  common: {
    learnMore: "En savoir plus",
    bookNow: "Prendre rendez-vous",
    discover: "Découvrir",
    seeAll: "Voir tout",
    addToCart: "Ajouter au panier",
    checkout: "Commander",
    continue: "Continuer",
    back: "Retour",
    confirm: "Confirmer",
    close: "Fermer",
    scheduleNow: "Réserver maintenant",
    whatsapp: "Écrire sur WhatsApp",
  },
  home: {
    eyebrow: "Beauté · Confiance · Expérience",
    title: "Le lieu où\nvotre beauté s'épanouit.",
    heroLine1: "Le lieu où",
    heroLine2Start: "votre",
    heroLine2Accent: "beauté",
    heroLine2End: "s'épanouit.",
    subtitle:
      "Chez Loma, chaque détail est pensé pour révéler votre meilleure version avec excellence, soin et une expérience premium.",
    seeServices: "Découvrir les services",
    aboutEyebrow: "Maison Loma",
    aboutTitle: "Beauté, santé capillaire et bien-être en un seul espace",
    aboutBody:
      "LOMA est bien plus qu'un salon — un espace conçu pour ralentir, prendre soin et transformer. Nous combinons techniques avancées, service personnalisé et une atmosphère sophistiquée et accueillante à Santa Cruz — Torres Vedras.",
    servicesEyebrow: "Services signature",
    servicesTitle: "Des rituels beauté taillés pour vous",
    productsEyebrow: "Boutique",
    productsTitle: "Des produits sélectionnés, des résultats salon à domicile",
    galleryEyebrow: "Galerie",
    galleryTitle: "Des résultats qui parlent d'eux-mêmes",
    testimonialsEyebrow: "Témoignages",
    testimonialsTitle: "De ceux qui nous confient leur soin",
    ctaTitle: "Réservez votre expérience Loma",
    ctaBody: "Disponibilité limitée. Chaque rendez-vous est unique.",
  },
  about: {
    eyebrow: "À propos",
    title: "Un espace premium pour la transformation capillaire et le soin de soi",
    body: "LOMA Clinic & Beauty Hair est née du désir de transformer le concept traditionnel de salon en une expérience complète de bien-être, d'estime de soi et de soin personnalisé. Fondée par Marina Loreti, spécialiste en beauté capillaire et trichologiste, LOMA a été créée avec une vision claire : offrir bien plus que des services capillaires — un espace où chaque cliente se sent accueillie, valorisée et prise en charge de façon unique.",
    missionTitle: "Notre mission",
    missionBody:
      "Offrir une expérience complète de beauté, de santé capillaire et de bien-être — où chaque cliente est prise en charge de manière unique, avec une technique avancée et une atmosphère chaleureuse qui respire la sophistication.",
    valuesTitle: "Ce qui nous distingue",
    values: [
      {
        t: "Santé capillaire",
        b: "Diagnostic personnalisé et traitements axés sur le bien-être du cuir chevelu et des cheveux.",
      },
      {
        t: "Expérience sensorielle",
        b: "Chaque visite est un rituel — aromathérapie, massage et soins conçus pour les sens.",
      },
      {
        t: "Service humanisé",
        b: "Chaque cliente est unique. Nous écoutons, évaluons et personnalisons chaque service à votre style de vie.",
      },
      {
        t: "Luxe accueillant",
        b: "Sophistication sans distance. Une atmosphère premium qui vous invite à ralentir et à embrasser le soin de soi.",
      },
    ],
  },
  services: {
    eyebrow: "Menu de services",
    title: "Chaque service, une signature LOMA",
    all: "Tout",
    featured: [
      "Coupe par techniciens",
      "Balayage",
      "Couleur racine S",
      "Brushing moyen",
      "Couleur racine M",
      "Coupe + brushing M",
    ],
    categories: [
      {
        name: "À la une",
        slug: "featured",
        items: [
          {
            name: "Coupe par techniciens",
            desc: "Transformez votre look avec une coupe par des techniciens qualifiés, sublimant votre beauté unique avec légèreté et modernité.",
            price: "20 €",
            time: "15 min",
          },
          {
            name: "Balayage",
            desc: "Des reflets lumineux au résultat naturel et durable. Inclut un soin post-décoloration au premier shampooing, valable jusqu'à une semaine.",
            price: "à partir de 120 €",
            time: "4 h",
          },
          {
            name: "Couleur racine S",
            desc: "Couleur vibrante et saine sur les racines, sans ammoniaque, idéale pour jusqu'à 2 cm de repousse.",
            price: "45 €",
            time: "1 h 30 min",
          },
          {
            name: "Brushing moyen",
            desc: "Brushing élégant apportant brillance et mouvement aux cheveux mi-longs.",
            price: "15 €",
            time: "40 min",
          },
          {
            name: "Couleur racine M",
            desc: "Couleur de racine à l'effet harmonieux et naturel, idéale pour jusqu'à 2 cm de repousse.",
            price: "50 €",
            time: "1 h 30 min",
          },
          {
            name: "Coupe + brushing M",
            desc: "Coupe moderne avec brushing impeccable, apportant légèreté et mouvement aux cheveux mi-longs.",
            price: "35 €",
            time: "1 h",
          },
        ],
      },
      {
        name: "Consultation / Devis",
        slug: "avaliacao",
        items: [
          {
            name: "Consultation capillaire",
            desc: "Bilan personnalisé avec recommandations spécifiques pour le soin idéal de vos cheveux. Femmes uniquement.",
            price: "35 €",
            time: "1 h",
          },
          {
            name: "Bilan / test de mèche",
            desc: "Évaluation capillaire pour identifier les besoins et recommander des solutions. Les frais sont déduits lors de la réservation d'un service technique.",
            price: "20 €",
            time: "30 min",
          },
        ],
      },
      {
        name: "Extensions capillaires",
        slug: "extensoes",
        items: [
          {
            name: "Entretien extensions +60 jours",
            desc: "Revitalisez vos extensions et préservez leur brillance et beauté après 60 jours d'utilisation.",
            price: "220 €",
            time: "1 h 30 min",
          },
          {
            name: "Entretien extensions jusqu'à 60 jours",
            desc: "Service idéal pour garder des extensions saines, naturelles et impeccables.",
            price: "180 €",
            time: "1 h 30 min",
          },
          {
            name: "Entretien extensions jusqu'à 30 jours",
            desc: "Soin spécialisé pour prolonger la durabilité et la beauté des extensions capillaires.",
            price: "150 €",
            time: "1 h 30 min",
          },
          {
            name: "Extensions (1re fois)",
            desc: "Pose d'extensions avec la technique à ruban adhésif, garantissant un résultat naturel sans abîmer les cheveux.",
            price: "220 €",
            time: "45 min",
          },
        ],
      },
      {
        name: "Lissage",
        slug: "alisamento",
        items: [
          {
            name: "Botox capillaire",
            desc: "Traitement qui revitalise les cheveux, offrant un aspect renouvelé, brillance et douceur.",
            price: "à partir de 75 €",
            time: "3 h",
          },
          {
            name: "Lissage",
            desc: "Cheveux lisses, soyeux et brillants. Prix variable selon la longueur.",
            price: "à partir de 100 €",
            time: "3 h",
          },
        ],
      },
      {
        name: "Wellness Spa",
        slug: "wellness",
        items: [
          {
            name: "Thérapie capillaire",
            desc: "Traitement revitalisant du cuir chevelu qui favorise la santé, l'équilibre et le renforcement de la racine.",
            price: "100 €",
            time: "1 h",
          },
          {
            name: "Head spa",
            desc: "Expérience profonde de relaxation et de soin capillaire, favorisant le bien-être physique et mental.",
            price: "75 €",
            time: "1 h 30 min",
          },
        ],
      },
      {
        name: "Programme capillaire",
        slug: "cronograma",
        items: [
          {
            name: "Exfoliation du cuir chevelu",
            desc: "Élimine les impuretés et résidus accumulés, revitalisant le cuir chevelu et préparant les cheveux aux traitements.",
            price: "35 €",
            time: "1 h",
          },
          {
            name: "Velatherapy",
            desc: "Technique qui élimine les fourches et revitalise les cheveux. Particulièrement recommandée pour les blondes. Non compatible avec le lissage, sauf lors de la transition vers les boucles.",
            price: "90 €",
            time: "2 h 30 min",
          },
          {
            name: "Programme capillaire",
            desc: "Traitement personnalisé d'hydratation, nutrition et reconstruction des cheveux.",
            price: "à partir de 45 €",
            time: "1 h",
          },
        ],
      },
      {
        name: "Mèches & Couleur",
        slug: "aclaramento",
        items: [
          {
            name: "Mèches",
            desc: "Technique d'éclaircissement qui apporte luminosité et sophistication aux cheveux.",
            price: "à partir de 100 €",
            time: "3 h",
          },
          {
            name: "Main levée",
            desc: "Éclaircissement artistique avec des coups de pinceau libres pour un résultat unique et naturel.",
            price: "à partir de 120 €",
            time: "4 h",
          },
          {
            name: "Soleil baiser",
            desc: "Pré-éclaircissement qui illumine et sublime la beauté naturelle des cheveux foncés.",
            price: "à partir de 120 €",
            time: "3 h",
          },
          {
            name: "Air touch",
            desc: "Technique de mèches utilisant un sèche-cheveux pour une transition douce et naturelle entre les tons.",
            price: "à partir de 120 €",
            time: "4 h",
          },
          {
            name: "Babylights",
            desc: "Mèches douces et délicates imitant l'éclaircissement naturel des cheveux d'enfance.",
            price: "à partir de 120 €",
            time: "4 h",
          },
          {
            name: "Balayage",
            desc: "Technique d'éclaircissement peinte à la main avec soin post-décoloration inclus.",
            price: "120 €",
            time: "4 h",
          },
          {
            name: "Blond intense",
            desc: "Pré-éclaircissement intense avec soin post-décoloration hydratant pour brillance et vitalité.",
            price: "à partir de 120 €",
            time: "4 h",
          },
          {
            name: "Toner L",
            desc: "Service de tonification pour neutraliser les reflets indésirables et sublimer la luminosité des cheveux longs.",
            price: "50 €",
            time: "1 h 30 min",
          },
          {
            name: "Toner M",
            desc: "Neutralise les tons indésirables et sublime la luminosité des cheveux mi-longs.",
            price: "45 €",
            time: "1 h 30 min",
          },
          {
            name: "Toner S",
            desc: "Tonification pour cheveux courts, apportant brillance et uniformité de couleur.",
            price: "40 €",
            time: "1 h 30 min",
          },
          {
            name: "Couleur racine L",
            desc: "Couvrance de racine jusqu'à 2 cm avec soin nutritif inclus, pour cheveux longs.",
            price: "55 €",
            time: "1 h 30 min",
          },
          {
            name: "Couleur racine M",
            desc: "Retouche de racine avec finition naturelle et harmonieuse pour cheveux mi-longs.",
            price: "50 €",
            time: "1 h 30 min",
          },
          {
            name: "Couleur racine S",
            desc: "Couleur douce sans ammoniaque pour racines courtes avec jusqu'à 2 cm de repousse.",
            price: "45 €",
            time: "1 h 30 min",
          },
          {
            name: "Couleur complète L",
            desc: "Couleur complète pour cheveux longs avec soin brillance et durabilité.",
            price: "70 €",
            time: "2 h 30 min",
          },
          {
            name: "Couleur complète M",
            desc: "Couleur complète sans ammoniaque pour cheveux mi-longs, garantissant santé et éclat.",
            price: "60 €",
            time: "2 h",
          },
          {
            name: "Couleur complète S",
            desc: "Couleur complète pour cheveux courts avec soin fortifiant inclus.",
            price: "55 €",
            time: "1 h 30 min",
          },
        ],
      },
      {
        name: "Coiffage",
        slug: "styling",
        items: [
          {
            name: "Chignon + maquillage",
            desc: "Chignon élégant combiné avec un maquillage professionnel pour toute occasion spéciale.",
            price: "90 €",
            time: "2 h",
          },
          {
            name: "Chignon avec brushing",
            desc: "Chignon stylisé avec brushing pour une finition lisse et sophistiquée.",
            price: "60 €",
            time: "1 h",
          },
          {
            name: "Chignon sans brushing",
            desc: "Chignon moderne sans brushing, idéal pour la praticité et l'authenticité.",
            price: "50 €",
            time: "30 min",
          },
          {
            name: "Coupe de frange",
            desc: "Coupe de frange personnalisée pour sublimer les traits du visage et rafraîchir le look.",
            price: "10 €",
            time: "15 min",
          },
          {
            name: "Coupe adolescent 11–15 ans",
            desc: "Coupe moderne pour adolescents avec lavage et séchage inclus.",
            price: "25 €",
            time: "1 h",
          },
          {
            name: "Coupe enfant 5–10 ans",
            desc: "Coupe pour enfants dans un environnement accueillant, adaptée à la personnalité de l'enfant.",
            price: "20 €",
            time: "40 min",
          },
          {
            name: "Coupe bébé 0–4 ans",
            desc: "Expérience de coupe douce et confortable pour les bébés.",
            price: "15 €",
            time: "20 min",
          },
          {
            name: "Coupe + brushing L",
            desc: "Coupe moderne avec brushing pour cheveux longs, apportant volume et mouvement.",
            price: "40 €",
            time: "1 h",
          },
          {
            name: "Coupe + brushing M",
            desc: "Coupe et brushing pour cheveux mi-longs avec légèreté et finition impeccable.",
            price: "35 €",
            time: "1 h",
          },
          {
            name: "Coupe + brushing S",
            desc: "Coupe stylée avec brushing pour cheveux courts, shampooing et après-shampooing inclus.",
            price: "30 €",
            time: "1 h",
          },
          {
            name: "Brushing long",
            desc: "Brushing pour cheveux longs avec brillance intense et finition sophistiquée.",
            price: "18 €",
            time: "1 h",
          },
          {
            name: "Brushing moyen",
            desc: "Brushing élégant pour cheveux mi-longs.",
            price: "15 €",
            time: "40 min",
          },
          {
            name: "Brushing court",
            desc: "Brushing pratique et sophistiqué pour cheveux courts jusqu'au niveau des oreilles.",
            price: "12 €",
            time: "30 min",
          },
        ],
      },
    ],
  },
  booking: {
    eyebrow: "Réservation en ligne",
    title: "Réservez en trois étapes élégantes",
    step: "Étape",
    of: "sur",
    chooseService: "Choisissez votre service",
    chooseProfessional: "Choisissez votre professionnel",
    chooseSlot: "Choisissez la date et l'heure",
    yourDetails: "Vos coordonnées",
    summary: "Récapitulatif de la réservation",
    name: "Nom complet",
    email: "E-mail",
    phone: "Téléphone",
    notes: "Notes (facultatif)",
    pay: "Confirmer",
    confirmed: "Réservation confirmée",
    confirmedBody:
      "Vous recevrez bientôt un e-mail avec tous les détails de votre expérience Loma.",
    newBooking: "Nouvelle réservation",
    noSlots:
      "Aucun horaire n'est disponible à cette date pour la durée du service sélectionné. Choisissez une autre date ou un autre service.",
    timeNeedsReselect:
      "L'horaire choisi n'est plus disponible pour ce service. Choisissez un autre horaire.",
    professionals: ["Marina Loreti", "Équipe LOMA"],
  },
  shop: {
    eyebrow: "Boutique Loma · Avani",
    title: "Soin capillaire professionnel, désormais aussi chez vous",
    brand: "Revendeur officiel Avani",
    filters: {
      all: "Tout",
      shampoo: "Shampooings",
      condicionador: "Après-shampooings",
      mascara: "Masques",
      oleo: "Huiles & Toniques",
      styling: "Coiffants",
      cronograma: "Programme Capillaire",
      gama: "Gammes & Kits",
      rotina: "Routines Luxury",
    },
    heroFeatures: {
      f1: "Service Personnalisé",
      f2: "Professionnelles Spécialisées",
      f3: "Produits Premium",
      f4: "Ambiance Exclusive",
    },
    watchVideo: "Expérience Loma",
    cart: "Panier",
    item: "article",
    items: "articles",
    empty: "Votre panier est vide.",
    subtotal: "Sous-total",
  },
  gallery: {
    eyebrow: "Portfolio",
    title: "Des créations qui reflètent l'âme Loma",
    tabs: { all: "Tout", before: "Avant & Après", salon: "Ambiance", team: "Équipe" },
  },
  testimonials: {
    items: [
      {
        n: "Beatriz M.",
        t: "Je suis repartie transformée. Le soin, l'ambiance et le résultat sont incomparables.",
      },
      {
        n: "Catarina S.",
        t: "J'ai enfin trouvé une équipe qui écoute et crée la coiffure autour de la personne.",
      },
      { n: "Maria L.", t: "Plus qu'un salon — une expérience sensorielle complète." },
      {
        n: "Rita F.",
        t: "La coloration est tout simplement impeccable. Un éclat qui dure des semaines.",
      },
    ],
  },
  contact: {
    eyebrow: "Rendez-nous visite",
    title: "Nous vous attendons",
    address: "Santa Cruz — Torres Vedras",
    hours: "Lun–Sam · 10h à 20h",
    formTitle: "Envoyez-nous un message",
    message: "Message",
    send: "Envoyer le message",
    sent: "Message envoyé. Nous vous contacterons prochainement.",
  },
  footer: {
    tagline: "Clinic & Beauty Hair",
    rights: "Tous droits réservés.",
    explore: "Explorer",
    contact: "Contact",
    follow: "Suivre",
    newsletter: "Recevez inspirations et offres exclusives",
    subscribe: "S'abonner",
    emailPh: "Votre e-mail",
    spam: "Nous promettons de ne pas envoyer de spam.",
    madeWithCare: "Made with care",
    benefits: [
      {
        title: "Produits premium",
        body: "Nous sélectionnons le meilleur pour vos cheveux.",
      },
      {
        title: "Service personnalisé",
        body: "Chaque détail est pensé spécialement pour vous.",
      },
      {
        title: "Atmosphère exclusive",
        body: "Un espace sophistiqué pour se détendre et prendre soin de soi.",
      },
      {
        title: "Réservation facile",
        body: "Réservez en ligne rapidement, simplement et en toute sécurité.",
      },
    ],
  },
  pros: {
    eyebrow: "Location d'espaces",
    hTitle: "Rejoignez l'expérience Loma",
    hSub: "Espaces conçus pour les professionnels de la beauté en quête de croissance, de sophistication et de liberté pour accueillir leurs clients dans un environnement premium.",
    ctaInfo: "Demander des informations",
    ctaVisit: "Planifier une visite",
    spacesEyebrow: "Espaces disponibles",
    spacesTitle: "Trouvez le format idéal pour votre carrière",
    spaces: [
      {
        n: "Chaise individuelle",
        d: "Station privée avec miroir éclairé, marbre et éclairage éditorial.",
        b: ["Location flexible", "Marbre + or", "Wifi premium"],
      },
      {
        n: "Suite premium",
        d: "Salle réservée pour des rendez-vous exclusifs en toute confidentialité.",
        b: ["Suite privée", "Climatisation", "Réception partagée"],
      },
      {
        n: "Station complète",
        d: "Plan de travail, bac à shampooiner et espace de travail complet pour coiffeurs.",
        b: ["Bac à shampooiner", "Rangement", "Support technique"],
      },
      {
        n: "Location à la journée",
        d: "Utilisez l'espace à la journée — idéal pour des projets, séances et invités.",
        b: ["Sans contrat", "Réservation en ligne", "Facturation simple"],
      },
      {
        n: "Location mensuelle",
        d: "Forfait mensuel avec une place fixe et une pleine visibilité dans le salon.",
        b: ["Place fixe", "Marketing partagé", "Tarif préférentiel"],
      },
      {
        n: "Espace coiffure",
        d: "Stations conçues pour les coupes, la coloration et les soins d'excellence.",
        b: ["Équipement pro", "Vapeur d'ozone", "Éclairage IRC 95"],
      },
      {
        n: "Espace nail designer",
        d: "Table en marbre, extraction et éclairage ciblé pour la manucure et la pédicure.",
        b: ["Extracteur silencieux", "Lumière dédiée", "Présentoir de couleurs"],
      },
      {
        n: "Espace esthétique",
        d: "Cabine complète pour les soins du visage, du corps et le bien-être.",
        b: ["Table premium", "Aromathérapie", "Musique d'ambiance"],
      },
    ],
    moreCta: "Je veux en savoir plus",
    beforeEyebrow: "Avant & Après",
    beforeTitle: "Des résultats qui bâtissent une réputation",
    beforeSub:
      "Travaillez dans un environnement où chaque transformation devient votre meilleure vitrine.",
    benefitsEyebrow: "Pour les professionnels",
    benefitsTitle: "Tout ce dont vous avez besoin pour grandir",
    benefits: [
      { t: "Environnement premium", d: "Finitions luxueuses et attention aux détails." },
      { t: "Agenda en ligne", d: "Système de réservation intégré 24h/24 et 7j/7." },
      { t: "Structure moderne", d: "Équipement professionnel toujours à jour." },
      { t: "Croissance", d: "Une communauté qui partage clients et savoir-faire." },
      { t: "Instagram-ready", d: "Décors pensés pour votre production de contenu." },
      { t: "Networking", d: "Événements privés et masterclasses régulières." },
      { t: "Emplacement stratégique", d: "Quartier prisé avec fort passage et parking." },
      { t: "Liberté professionnelle", d: "Vos prix, votre marque, vos horaires." },
      {
        t: "Ambiance sophistiquée",
        d: "Réception, café et atmosphère qui valorisent votre image.",
      },
    ],
    experienceEyebrow: "Expérience",
    experienceTitle: "Plus qu'un espace de travail.\nUne expérience professionnelle.",
    experienceBody:
      "Café de spécialité, une réception élégante, des clients satisfaits et une communauté qui célèbre votre art. Chaque détail est pensé pour sublimer la façon dont vous accueillez ceux qui vous font confiance.",
    formEyebrow: "Candidature Professionnels - LOMA",
    formTitle: "Bienvenue chez LOMA",
    formIntro:
      "LOMA est un espace de beauté et wellness pensé pour les professionnels qui valorisent la liberté professionnelle, un positionnement premium et une croissance partagée. Nous sélectionnons des professionnels alignés avec l'identité de la marque, souhaitant travailler dans un environnement élégant, organisé et centré sur l'expérience client. Remplissez ce formulaire afin que nous puissions mieux connaître votre profil.",
    fName: "Nom complet",
    fEmail: "Email",
    fAge: "Âge",
    fPhone: "Contact",
    fInsta: "Instagram professionnel",
    fArea: "Domaine d'activité",
    fAreaOptions: ["Coiffeur", "Barbier", "Maquilleuse", "Technicienne Head spa"],
    fYears: "Depuis combien d'années travaillez-vous dans ce domaine ?",
    fRental: "Avez-vous déjà travaillé en régime de location ?",
    fYesNo: ["Oui", "Non"],
    fClientBase: "Avez-vous votre propre clientèle ?",
    fClientBaseOptions: ["Oui", "Partiellement", "Non"],
    fMainService: "Quel est votre service principal ?",
    fMostServices: "Quels services réalisez-vous le plus souvent ?",
    fWorkspace: "Que recherchez-vous dans un espace de travail ?",
    fWhyLoma: "Pourquoi souhaitez-vous intégrer LOMA ?",
    fClientExperience: "Qu'est-ce que vous valorisez dans l'expérience client ?",
    fPositioning: "Comment décrivez-vous votre positionnement professionnel ?",
    fOrganized: "Travaillez-vous avec un agenda organisé ?",
    fContent: "Créez-vous habituellement du contenu pour les réseaux sociaux ?",
    fPartnership: "Que signifie pour vous travailler en partenariat avec d'autres professionnels ?",
    fAvoid: "Quel type d'environnement souhaitez-vous éviter ?",
    fDifferentiator: "Qu'est-ce qui vous différencie comme professionnel ?",
    fSubmit: "Envoyer la candidature",
    fSent: "Nous avons reçu votre candidature. Un email de confirmation a été envoyé.",
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Tout ce que vous devez savoir",
    sections: [
      {
        title: "À propos du salon",
        items: [
          {
            q: "Qu'est-ce qui rend LOMA différent ?",
            a: "LOMA est bien plus qu'un salon — c'est un espace conçu pour ralentir, prendre soin et transformer. Nous combinons technique avancée, service personnalisé et une atmosphère sophistiquée et accueillante. Chaque cliente est traitée de manière unique, avec son propre diagnostic et protocole.",
          },
          {
            q: "LOMA travaille-t-il uniquement avec les cheveux ?",
            a: "Notre focus principal est la santé et la beauté capillaire, incluant les blondes, la coloration, les extensions, la thérapie capillaire et le Head Spa. N'hésitez pas à contacter notre équipe pour savoir quels services correspondent le mieux à vos attentes.",
          },
          {
            q: "Où se trouve LOMA ?",
            a: "Nous sommes situés à Santa Cruz, Torres Vedras. Pour l'adresse exacte et les indications, visitez notre page Contact ou envoyez-nous un message WhatsApp.",
          },
        ],
      },
      {
        title: "Rendez-vous",
        items: [
          {
            q: "Comment prendre rendez-vous ?",
            a: "Vous pouvez réserver directement sur notre site, via WhatsApp ou par e-mail à Lomahairspa@gmail.com. Nous répondons dans les meilleurs délais.",
          },
          {
            q: "Faut-il réserver à l'avance ?",
            a: "Oui. Nous recommandons toujours de réserver à l'avance pour garantir la disponibilité et préparer le service idéal pour vous. Pour les services blondes et extensions, la réservation anticipée est particulièrement importante.",
          },
          {
            q: "Puis-je annuler ou modifier mon rendez-vous ?",
            a: "Oui. Nous vous demandons d'effectuer toute annulation ou modification au moins 24 heures à l'avance, afin que nous puissions réorganiser le planning et servir d'autres clients.",
          },
          {
            q: "LOMA accepte-t-il les clients sans rendez-vous ?",
            a: "Occasionnellement, sous réserve de disponibilité. Pour garantir la meilleure expérience, la réservation préalable est toujours recommandée.",
          },
        ],
      },
      {
        title: "Blondes et coloration",
        items: [
          {
            q: "LOMA est-il spécialisé dans les blondes ?",
            a: "Oui. Les blondes personnalisées sont l'une de nos grandes spécialités. Nous travaillons des techniques telles que le balayage, les mèches, le blond soleil et la correction de couleur, toujours en mettant l'accent sur la santé des cheveux.",
          },
          {
            q: "Est-il possible d'éclaircir sans abîmer ?",
            a: "Avec les bons produits et le bon protocole, oui. Nous évaluons toujours l'état des cheveux au préalable et recommandons le processus le plus sûr et efficace pour votre cas.",
          },
          {
            q: "Combien de temps dure un service blondes ?",
            a: "Selon la technique et l'état de départ des cheveux, cela peut varier de 2 à 8 heures. Pour une estimation personnalisée, prenez rendez-vous pour une consultation préalable.",
          },
          {
            q: "Faites-vous des corrections de couleur ?",
            a: "Oui. La correction de couleur est l'un des services que nous proposons. Nous recommandons de venir en consultation avant de programmer le service complet.",
          },
        ],
      },
      {
        title: "Thérapie capillaire",
        items: [
          {
            q: "Qu'est-ce que la thérapie capillaire ?",
            a: "C'est un ensemble de traitements spécialisés visant à diagnostiquer et traiter les problèmes du cuir chevelu et des cheveux, comme la chute, l'excès de sébum, la sécheresse ou la fragilité. Chez LOMA, nous utilisons des protocoles personnalisés avec des actifs professionnels.",
          },
          {
            q: "Comment savoir si j'ai besoin d'une thérapie capillaire ?",
            a: "Des signes comme une chute excessive, un cuir chevelu gras ou irrité, des cheveux cassants ou sans éclat sont indicatifs. Nous proposons un diagnostic gratuit lors de la première consultation.",
          },
          {
            q: "Combien de séances sont nécessaires ?",
            a: "Cela dépend du diagnostic et de l'objectif. En général, nous recommandons un protocole de 4 à 6 séances pour des résultats visibles et durables, avec un entretien périodique.",
          },
        ],
      },
      {
        title: "Extensions capillaires",
        items: [
          {
            q: "Les extensions abîment-elles les cheveux naturels ?",
            a: "Lorsqu'elles sont posées et retirées correctement par des professionnels expérimentés, les extensions n'abîment pas les cheveux naturels. Chez LOMA, nous utilisons des techniques à faible impact et accompagnons la cliente tout au long du processus.",
          },
          {
            q: "Les extensions sont-elles visibles ?",
            a: "Non. Nous travaillons avec des techniques imperceptibles, adaptées à la couleur et à la texture de vos cheveux, pour un résultat totalement naturel.",
          },
          {
            q: "Combien de temps durent-elles ?",
            a: "En moyenne 3 à 4 mois avec un entretien adapté. La durabilité dépend des soins à domicile et du type de cheveux. Nous vous donnons toutes les instructions nécessaires.",
          },
        ],
      },
      {
        title: "Head Spa & Wellness",
        items: [
          {
            q: "Qu'est-ce que le Head Spa ?",
            a: "Le Head Spa est un rituel de bien-être capillaire combinant massage du cuir chevelu, nettoyage en profondeur et soins sensoriels. Il est profondément relaxant et en même temps bénéfique pour la santé des cheveux.",
          },
          {
            q: "Le Head Spa est-il seulement relaxant ?",
            a: "Non. Au-delà de la relaxation, le Head Spa stimule la circulation sanguine dans le cuir chevelu, favorise la croissance des cheveux et élimine les impuretés accumulées. Il est à la fois thérapeutique et esthétique.",
          },
          {
            q: "Puis-je offrir un service en cadeau ?",
            a: "Oui ! Nos services peuvent être offerts sous forme de bon cadeau. Contactez-nous pour savoir comment acquérir un bon personnalisé.",
          },
        ],
      },
      {
        title: "Produits & soins à domicile",
        items: [
          {
            q: "LOMA vend-il des produits professionnels ?",
            a: "Oui. Dans notre boutique en ligne et au salon, vous trouverez une sélection de produits professionnels utilisés dans nos traitements, pour que vous puissiez maintenir les résultats à domicile.",
          },
          {
            q: "Vais-je recevoir des conseils pour les soins à domicile ?",
            a: "Toujours. À la fin de chaque service, notre équipe partage une routine de soins personnalisée à domicile, adaptée à vos cheveux et au traitement effectué.",
          },
        ],
      },
      {
        title: "Accueil client",
        items: [
          {
            q: "Le premier bilan est-il inclus ?",
            a: "Oui. Nous effectuons toujours une consultation initiale sans frais supplémentaires pour comprendre les besoins de vos cheveux et recommander le protocole le plus adapté.",
          },
          {
            q: "LOMA accueille-t-il uniquement les femmes ?",
            a: "Non. Nous accueillons tous les genres. Notre espace est inclusif et nos services sont adaptés à tout type de cheveux.",
          },
          {
            q: "Puis-je venir accompagné(e) ?",
            a: "Bien sûr. L'espace a été pensé pour être accueillant. Les accompagnateurs sont toujours les bienvenus, en veillant au confort de tous.",
          },
        ],
      },
    ],
  },
};
