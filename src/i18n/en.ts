import type { Dict } from "./pt";

export const en: Dict = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    booking: "Booking",
    shop: "Shop",
    gallery: "Gallery",
    contact: "Contact",
    pros: "Professionals",
    faq: "FAQ",
    bookCta: "Book a Visit",
  },
  common: {
    learnMore: "Learn More",
    bookNow: "Book Appointment",
    discover: "Discover",
    seeAll: "See All",
    addToCart: "Add to Cart",
    checkout: "Checkout",
    continue: "Continue",
    back: "Back",
    confirm: "Confirm",
    close: "Close",
    scheduleNow: "Book Now",
    whatsapp: "Chat on WhatsApp",
  },
  home: {
    eyebrow: "Beauty · Confidence · Experience",
    title: "The place where\nyour beauty blooms.",
    heroLine1: "The place where",
    heroLine2Start: "your",
    heroLine2Accent: "beauty",
    heroLine2End: "blooms.",
    subtitle:
      "At Loma, every detail is designed to enhance your finest self with excellence, care and a premium experience.",
    seeServices: "Discover Services",
    aboutEyebrow: "Maison Loma",
    aboutTitle: "Beauty, hair health and wellness in one space",
    aboutBody:
      "LOMA is more than a salon — a space designed to slow down, care and transform. We combine advanced techniques, personalised service and a sophisticated, welcoming atmosphere in Santa Cruz — Torres Vedras.",
    servicesEyebrow: "Signature services",
    servicesTitle: "Beauty rituals tailored to you",
    productsEyebrow: "Boutique",
    productsTitle: "Curated products, salon results at home",
    galleryEyebrow: "Gallery",
    galleryTitle: "Results that speak for themselves",
    testimonialsEyebrow: "Testimonials",
    testimonialsTitle: "From those who trust us with their care",
    ctaTitle: "Reserve your Loma experience",
    ctaBody: "Limited availability. Each appointment is unique.",
  },
  about: {
    eyebrow: "About Us",
    title: "A premium space for hair transformation and self-care",
    body: "LOMA Clinic & Beauty Hair was born from the desire to transform the traditional salon concept into a complete experience of wellness, self-esteem and personalised care. Founded by Marina Loreti, hair beauty specialist and trichologist, LOMA was created with a clear vision: to offer far more than hair services — a space where every client feels welcomed, valued and uniquely cared for.",
    missionTitle: "Our mission",
    missionBody:
      "To offer a complete experience of beauty, hair health and wellness — where every client is cared for in a unique way, with advanced technique and a welcoming atmosphere that breathes sophistication.",
    valuesTitle: "What sets us apart",
    values: [
      {
        t: "Hair Health",
        b: "Personalised diagnosis and treatments focused on scalp and hair wellbeing.",
      },
      {
        t: "Sensory Experience",
        b: "Every visit is a ritual — aromatherapy, massage and care designed for the senses.",
      },
      {
        t: "Humanised Service",
        b: "Every client is unique. We listen, evaluate and personalise each service to your lifestyle.",
      },
      {
        t: "Welcoming Luxury",
        b: "Sophistication without distance. A premium atmosphere that invites you to slow down and embrace self-care.",
      },
    ],
  },
  services: {
    eyebrow: "Service Menu",
    title: "Every service, a LOMA signature",
    all: "All",
    featured: [
      "Haircut by technicians",
      "Balayage",
      "Root colour S",
      "Medium blow-dry",
      "Root colour M",
      "Cut & blow-dry M",
    ],
    categories: [
      {
        name: "Featured",
        slug: "featured",
        items: [
          {
            name: "Haircut by technicians",
            desc: "Transform your look with a haircut by qualified technicians, enhancing your unique beauty with lightness and modernity.",
            price: "€20",
            time: "15 min",
          },
          {
            name: "Balayage",
            desc: "Radiant highlights with a natural, long-lasting result. Includes post-highlight treatment on first wash, valid for up to one week.",
            price: "from €120",
            time: "4 h",
          },
          {
            name: "Root colour S",
            desc: "Vibrant, healthy colour on the roots, ammonia-free, ideal for up to 2 cm of regrowth.",
            price: "€45",
            time: "1 h 30 min",
          },
          {
            name: "Medium blow-dry",
            desc: "Elegant blow-dry that provides shine and movement to shoulder-length hair.",
            price: "€15",
            time: "40 min",
          },
          {
            name: "Root colour M",
            desc: "Root colour with a harmonious and natural effect, ideal for up to 2 cm of regrowth.",
            price: "€50",
            time: "1 h 30 min",
          },
          {
            name: "Cut & blow-dry M",
            desc: "Modern cut with impeccable blow-dry, bringing lightness and movement to medium hair.",
            price: "€35",
            time: "1 h",
          },
        ],
      },
      {
        name: "Consultation / Quote",
        slug: "avaliacao",
        items: [
          {
            name: "Hair consultation",
            desc: "Personalised assessment with specific recommendations for the ideal care of your hair. Women only.",
            price: "€35",
            time: "1 h",
          },
          {
            name: "Assessment / strand test",
            desc: "Hair assessment to identify needs and recommend solutions. The fee is deducted when booking a technical service.",
            price: "€20",
            time: "30 min",
          },
        ],
      },
      {
        name: "Hair Extensions",
        slug: "extensoes",
        items: [
          {
            name: "Extensions maintenance +60 days",
            desc: "Revitalise your extensions and keep their shine and beauty even after 60 days of use.",
            price: "€220",
            time: "1 h 30 min",
          },
          {
            name: "Extensions maintenance up to 60 days",
            desc: "Ideal service to keep extensions healthy, natural and impeccable.",
            price: "€180",
            time: "1 h 30 min",
          },
          {
            name: "Extensions maintenance up to 30 days",
            desc: "Specialised care to extend the durability and beauty of hair extensions.",
            price: "€150",
            time: "1 h 30 min",
          },
          {
            name: "Extensions (1st time)",
            desc: "Application of extensions with adhesive tape technique, ensuring a natural result without damaging the hair.",
            price: "€220",
            time: "45 min",
          },
        ],
      },
      {
        name: "Straightening",
        slug: "alisamento",
        items: [
          {
            name: "Botox",
            desc: "Treatment that revitalises the hair, providing a renewed appearance, shine and softness.",
            price: "from €75",
            time: "3 h",
          },
          {
            name: "Straightening",
            desc: "Smooth, silky and shiny hair. Prices vary according to length.",
            price: "from €100",
            time: "3 h",
          },
        ],
      },
      {
        name: "Wellness Spa",
        slug: "wellness",
        items: [
          {
            name: "Hair therapy",
            desc: "Revitalising scalp treatment that promotes health, balance and strengthening of the root.",
            price: "€100",
            time: "1 h",
          },
          {
            name: "Head spa",
            desc: "Deep experience of relaxation and hair care, promoting physical and mental well-being.",
            price: "€75",
            time: "1 h 30 min",
          },
        ],
      },
      {
        name: "Hair Schedule",
        slug: "cronograma",
        items: [
          {
            name: "Scalp exfoliation",
            desc: "Eliminates impurities and accumulated residues, revitalising the scalp and preparing the hair for treatments.",
            price: "€35",
            time: "1 h",
          },
          {
            name: "Velatherapy",
            desc: "Technique that removes split ends and revitalises the hair. Especially recommended for blondes. Not compatible with straightening, except when transitioning to curls.",
            price: "€90",
            time: "2 h 30 min",
          },
          {
            name: "Hair schedule",
            desc: "Personalised treatment for hydration, nutrition and reconstruction of the hair.",
            price: "from €45",
            time: "1 h",
          },
        ],
      },
      {
        name: "Highlights & Colour",
        slug: "aclaramento",
        items: [
          {
            name: "Highlights",
            desc: "Lightening technique that provides luminosity and sophistication to the hair.",
            price: "from €100",
            time: "3 h",
          },
          {
            name: "Free hands",
            desc: "Artistic lightening with free brushstrokes for a unique and natural result.",
            price: "from €120",
            time: "4 h",
          },
          {
            name: "Sun-kissed",
            desc: "Pre-lightening that illuminates and enhances the natural beauty of dark hair.",
            price: "from €120",
            time: "3 h",
          },
          {
            name: "Air touch",
            desc: "Highlights technique using an air dryer for a smooth and natural transition between tones.",
            price: "from €120",
            time: "4 h",
          },
          {
            name: "Babylights",
            desc: "Soft and delicate highlights that mimic the natural lightening of childhood hair.",
            price: "from €120",
            time: "4 h",
          },
          {
            name: "Balayage",
            desc: "Hand-painted lightening technique with post-highlight treatment included.",
            price: "€120",
            time: "4 h",
          },
          {
            name: "Super blond",
            desc: "Intense pre-lightening with moisturising post-highlight treatment for shine and vitality.",
            price: "from €120",
            time: "4 h",
          },
          {
            name: "Toner L",
            desc: "Toning service to neutralise unwanted reflections and enhance the luminosity of long hair.",
            price: "€50",
            time: "1 h 30 min",
          },
          {
            name: "Toner M",
            desc: "Neutralises unwanted tones and enhances the luminosity of medium hair.",
            price: "€45",
            time: "1 h 30 min",
          },
          {
            name: "Toner S",
            desc: "Toning for short hair, providing shine and colour uniformity.",
            price: "€40",
            time: "1 h 30 min",
          },
          {
            name: "Root colour L",
            desc: "Root coverage up to 2 cm with nutritive treatment included, for long hair.",
            price: "€55",
            time: "1 h 30 min",
          },
          {
            name: "Root colour M",
            desc: "Root retouch with natural and harmonious finish for medium hair.",
            price: "€50",
            time: "1 h 30 min",
          },
          {
            name: "Root colour S",
            desc: "Gentle ammonia-free colour for short roots with up to 2 cm of regrowth.",
            price: "€45",
            time: "1 h 30 min",
          },
          {
            name: "Full colour L",
            desc: "Full colour for long hair with shine and durability treatment.",
            price: "€70",
            time: "2 h 30 min",
          },
          {
            name: "Full colour M",
            desc: "Full ammonia-free colour for medium hair, ensuring health and shine.",
            price: "€60",
            time: "2 h",
          },
          {
            name: "Full colour S",
            desc: "Full colour for short hair with strengthening treatment included.",
            price: "€55",
            time: "1 h 30 min",
          },
        ],
      },
      {
        name: "Styling",
        slug: "styling",
        items: [
          {
            name: "Updo + make-up",
            desc: "Elegant updo combined with professional make-up for any special occasion.",
            price: "€90",
            time: "2 h",
          },
          {
            name: "Updo with blow-dry",
            desc: "Stylised updo with blow-dry for a smooth and sophisticated finish.",
            price: "€60",
            time: "1 h",
          },
          {
            name: "Updo without blow-dry",
            desc: "Modern updo without blow-dry, ideal for practicality and authenticity.",
            price: "€50",
            time: "30 min",
          },
          {
            name: "Fringe trim",
            desc: "Personalised fringe trim to enhance facial features and refresh the look.",
            price: "€10",
            time: "15 min",
          },
          {
            name: "Teen haircut 11–15 yrs",
            desc: "Modern cut for teenagers with wash and dry included.",
            price: "€25",
            time: "1 h",
          },
          {
            name: "Child haircut 5–10 yrs",
            desc: "Children's cut in a welcoming environment, adapted to the child's personality.",
            price: "€20",
            time: "40 min",
          },
          {
            name: "Baby haircut 0–4 yrs",
            desc: "Delicate and comfortable cut experience for babies.",
            price: "€15",
            time: "20 min",
          },
          {
            name: "Cut & blow-dry L",
            desc: "Modern cut with blow-dry for long hair, providing volume and movement.",
            price: "€40",
            time: "1 h",
          },
          {
            name: "Cut & blow-dry M",
            desc: "Cut and blow-dry for medium hair with lightness and impeccable finish.",
            price: "€35",
            time: "1 h",
          },
          {
            name: "Cut & blow-dry S",
            desc: "Stylish cut with blow-dry for short hair, including shampoo and conditioner.",
            price: "€30",
            time: "1 h",
          },
          {
            name: "Long blow-dry",
            desc: "Blow-dry for long hair with intense shine and sophisticated finish.",
            price: "€18",
            time: "1 h",
          },
          {
            name: "Medium blow-dry",
            desc: "Elegant blow-dry for shoulder-length hair.",
            price: "€15",
            time: "40 min",
          },
          {
            name: "Short blow-dry",
            desc: "Practical and sophisticated blow-dry for short hair up to ear level.",
            price: "€12",
            time: "30 min",
          },
        ],
      },
    ],
  },
  booking: {
    eyebrow: "Online Booking",
    title: "Book in three elegant steps",
    step: "Step",
    of: "of",
    chooseService: "Choose your service",
    chooseProfessional: "Choose your professional",
    chooseSlot: "Choose date and time",
    yourDetails: "Your details",
    summary: "Booking summary",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    notes: "Notes (optional)",
    pay: "Confirm",
    confirmed: "Booking confirmed",
    confirmedBody:
      "You will shortly receive an email with all the details of your Loma experience.",
    newBooking: "New booking",
    noSlots:
      "There are no available times on this date for the selected service duration. Choose another date or service.",
    timeNeedsReselect:
      "The selected time is no longer available for this service. Choose another time.",
    professionals: ["Marina Loreti", "LOMA Team"],
  },
  shop: {
    eyebrow: "Loma Boutique · Avani",
    title: "Professional hair care, now also at home",
    brand: "Authorized Avani reseller",
    filters: {
      all: "All",
      shampoo: "Shampoos",
      condicionador: "Conditioners",
      mascara: "Masks",
      oleo: "Oils & Tonics",
      styling: "Styling",
      cronograma: "Hair Schedule",
      gama: "Ranges & Kits",
      rotina: "Luxury Routines",
    },
    heroFeatures: {
      f1: "Personalised Service",
      f2: "Specialist Professionals",
      f3: "Premium Products",
      f4: "Exclusive Ambience",
    },
    watchVideo: "Loma Experience",
    cart: "Cart",
    item: "item",
    items: "items",
    empty: "Your cart is empty.",
    subtotal: "Subtotal",
  },
  gallery: {
    eyebrow: "Portfolio",
    title: "Work that reflects the Loma soul",
    tabs: { all: "All", before: "Before & After", salon: "Atmosphere", team: "Team" },
  },
  testimonials: {
    items: [
      { n: "Beatriz M.", t: "I left transformed. The care, atmosphere and result are unmatched." },
      {
        n: "Catarina S.",
        t: "I finally found a team that listens and designs hair around the person.",
      },
      { n: "Maria L.", t: "More than a salon — a complete sensory experience." },
      { n: "Rita F.", t: "The colour work is simply impeccable. Shine that lasts for weeks." },
    ],
  },
  contact: {
    eyebrow: "Visit Us",
    title: "We look forward to welcoming you",
    address: "R. da Azenha 6, 2560-474 Silveira, Torres Vedras",
    hours: "Mon–Sat · 10am to 8pm",
    formTitle: "Send us a message",
    message: "Message",
    send: "Send Message",
    sent: "Message sent. We will be in touch shortly.",
  },
  footer: {
    tagline: "Clinic & Beauty Hair",
    rights: "All rights reserved.",
    explore: "Explore",
    contact: "Contact",
    follow: "Follow",
    newsletter: "Receive inspiration and exclusive offers",
    subscribe: "Subscribe",
    emailPh: "Your email",
    spam: "We promise not to send spam.",
    madeWithCare: "Made with care",
    benefits: [
      {
        title: "Premium products",
        body: "We select the best for your hair.",
      },
      {
        title: "Personalised care",
        body: "Every detail is designed especially for you.",
      },
      {
        title: "Exclusive atmosphere",
        body: "A sophisticated space to relax and take care of yourself.",
      },
      {
        title: "Easy booking",
        body: "Book online quickly, safely and easily.",
      },
    ],
  },
  pros: {
    eyebrow: "Studio Rental",
    hTitle: "Become part of the Loma experience",
    hSub: "Spaces designed for beauty professionals seeking growth, sophistication and the freedom to welcome their clients in a premium environment.",
    ctaInfo: "Request Information",
    ctaVisit: "Book a Tour",
    spacesEyebrow: "Available spaces",
    spacesTitle: "Find the format that fits your career",
    spaces: [
      {
        n: "Individual Chair",
        d: "Private station with illuminated mirror, marble and editorial lighting.",
        b: ["Flexible rental", "Marble + gold", "Premium wifi"],
      },
      {
        n: "Premium Suite",
        d: "A reserved room for exclusive appointments with full privacy.",
        b: ["Private suite", "Climate control", "Shared reception"],
      },
      {
        n: "Full Station",
        d: "Counter, wash unit and complete working area for hairstylists.",
        b: ["Wash basin", "Storage", "Tech support"],
      },
      {
        n: "Daily Rental",
        d: "Use the space by the day — perfect for projects, shoots and guests.",
        b: ["No contract", "Online booking", "Easy invoicing"],
      },
      {
        n: "Monthly Rental",
        d: "Monthly plan with a permanent spot and full salon visibility.",
        b: ["Fixed spot", "Shared marketing", "Preferred rate"],
      },
      {
        n: "Hairstylist Space",
        d: "Stations crafted for cuts, color and signature treatments.",
        b: ["Pro equipment", "Ozone vapour", "CRI 95 lighting"],
      },
      {
        n: "Nail Designer Space",
        d: "Marble desk, extraction and focused lighting for manicure and pedicure.",
        b: ["Silent extractor", "Dedicated light", "Color display"],
      },
      {
        n: "Aesthetics Space",
        d: "Full cabin for facial, body and wellness treatments.",
        b: ["Premium bed", "Aromatherapy", "Ambient sound"],
      },
    ],
    moreCta: "I want to know more",
    beforeEyebrow: "Before & After",
    beforeTitle: "Results that build reputation",
    beforeSub: "Work in an environment where every transformation becomes your finest showcase.",
    benefitsEyebrow: "For professionals",
    benefitsTitle: "Everything you need to grow",
    benefits: [
      { t: "Premium environment", d: "Luxury finishes and attention to detail." },
      { t: "Online agenda", d: "Integrated 24/7 booking system." },
      { t: "Modern structure", d: "Always up-to-date professional equipment." },
      { t: "Growth", d: "A community that shares clients and know-how." },
      { t: "Instagram-ready", d: "Backdrops designed for your content production." },
      { t: "Networking", d: "Private events and regular masterclasses." },
      { t: "Prime location", d: "Premium district with high footfall and parking." },
      { t: "Professional freedom", d: "Your prices, your brand, your schedule." },
      { t: "Sophisticated vibe", d: "Reception, coffee and atmosphere that elevate your image." },
    ],
    experienceEyebrow: "Experience",
    experienceTitle: "More than a workplace.\nA professional experience.",
    experienceBody:
      "Specialty coffee, an elegant reception, happy clients and a community that celebrates your craft. Every detail is designed to elevate the way you welcome those who trust you.",
    formEyebrow: "Professional Application - LOMA",
    formTitle: "Welcome to LOMA",
    formIntro:
      "LOMA is a beauty and wellness space designed for professionals who value professional freedom, premium positioning and shared growth. We are selecting professionals aligned with the brand identity who want to work in an elegant, organised environment focused on the client experience. Fill in this form so we can get to know your profile better.",
    fName: "Full name",
    fEmail: "Email",
    fAge: "Age",
    fPhone: "Contact",
    fInsta: "Professional Instagram",
    fArea: "Field of work",
    fAreaOptions: ["Hairstylist", "Barber", "Make-up artist", "Head spa technician"],
    fYears: "How many years have you worked in the field?",
    fRental: "Have you worked in a rental model before?",
    fYesNo: ["Yes", "No"],
    fClientBase: "Do you have your own client base?",
    fClientBaseOptions: ["Yes", "Partially", "No"],
    fMainService: "What is your main service?",
    fMostServices: "Which services do you perform most often?",
    fWorkspace: "What are you looking for in a workspace?",
    fWhyLoma: "Why would you like to join LOMA?",
    fClientExperience: "What do you value in the client experience?",
    fPositioning: "How do you describe your professional positioning?",
    fOrganized: "Do you work with an organised schedule?",
    fContent: "Do you usually create content for social media?",
    fPartnership: "What does working in partnership with other professionals mean to you?",
    fAvoid: "What type of environment do you want to avoid?",
    fDifferentiator: "What makes you different as a professional?",
    fSubmit: "Send application",
    fSent: "We received your application. A confirmation email has been sent.",
  },
  faq: {
    eyebrow: "Frequently Asked Questions",
    title: "Everything you need to know",
    sections: [
      {
        title: "About the Salon",
        items: [
          {
            q: "What makes LOMA different?",
            a: "LOMA is more than a salon — it is a space designed to slow down, care and transform. We combine advanced technique, personalised service and a sophisticated, welcoming atmosphere. Every client is treated uniquely, with their own diagnosis and protocol.",
          },
          {
            q: "Does LOMA only work with hair?",
            a: "Our main focus is hair health and beauty, including blondes, colour, extensions, hair therapy and Head Spa. Feel free to contact our team to find out which services best match what you are looking for.",
          },
          {
            q: "Where is LOMA located?",
            a: "We are at R. da Azenha 6, 2560-474 Silveira, Torres Vedras. For directions, visit our Contact page or send us a WhatsApp message.",
          },
        ],
      },
      {
        title: "Appointments",
        items: [
          {
            q: "How can I make a booking?",
            a: "You can book directly on our website, via WhatsApp or by email at Lomahairspa@gmail.com. We respond as quickly as possible.",
          },
          {
            q: "Do I need to book in advance?",
            a: "Yes. We always recommend booking ahead to ensure availability and prepare the ideal service for you. For blonde and extension services, advance booking is especially important.",
          },
          {
            q: "Can I cancel or change my booking?",
            a: "Yes. We ask that any cancellation or change be made at least 24 hours in advance, so we can reorganise the schedule and serve other clients.",
          },
          {
            q: "Does LOMA accept walk-in clients?",
            a: "Occasionally, subject to availability. To ensure the best experience, prior booking is always recommended.",
          },
        ],
      },
      {
        title: "Blondes and Colour",
        items: [
          {
            q: "Does LOMA specialise in blondes?",
            a: "Yes. Personalised blondes are one of our greatest specialities. We work with techniques such as balayage, highlights, sun-kissed blonde and colour correction, always focused on hair health.",
          },
          {
            q: "Is it possible to lighten hair without damage?",
            a: "With the right products and the right protocol, yes. We always assess the hair condition beforehand and recommend the safest and most effective process for your case.",
          },
          {
            q: "How long does a blonde service take?",
            a: "Depending on the technique and starting condition of the hair, it can range from 2 to 8 hours. For a personalised estimate, book a prior consultation.",
          },
          {
            q: "Do you do colour corrections?",
            a: "Yes. Colour correction is one of the services we offer. We recommend coming in for a consultation before scheduling the full service.",
          },
        ],
      },
      {
        title: "Hair Therapy",
        items: [
          {
            q: "What is hair therapy?",
            a: "It is a set of specialised treatments designed to diagnose and treat scalp and hair issues such as hair loss, oiliness, dryness or fragility. At LOMA we use personalised protocols with professional actives.",
          },
          {
            q: "How do I know if I need hair therapy?",
            a: "Signs such as excessive hair loss, oily or irritated scalp, brittle or dull hair are indicators. We offer a free diagnosis at the first consultation.",
          },
          {
            q: "How many sessions are needed?",
            a: "It depends on the diagnosis and the goal. Generally, we recommend a protocol of 4 to 6 sessions for visible and lasting results, with periodic maintenance.",
          },
        ],
      },
      {
        title: "Hair Extensions",
        items: [
          {
            q: "Do extensions damage natural hair?",
            a: "When applied and removed correctly by experienced professionals, extensions do not damage natural hair. At LOMA we use low-impact techniques and support the client throughout the entire process.",
          },
          {
            q: "Are extensions visible?",
            a: "No. We work with imperceptible techniques, adapted to your hair colour and texture, for a completely natural result.",
          },
          {
            q: "How long do they last?",
            a: "On average 3 to 4 months with proper care. Durability depends on home care and hair type. We provide all the guidance you need.",
          },
        ],
      },
      {
        title: "Head Spa & Wellness",
        items: [
          {
            q: "What is the Head Spa?",
            a: "The Head Spa is a hair wellness ritual combining scalp massage, deep cleansing and sensory treatments. It is deeply relaxing and at the same time beneficial for hair health.",
          },
          {
            q: "Is the Head Spa only about relaxation?",
            a: "No. Beyond relaxation, the Head Spa stimulates blood circulation in the scalp, promotes hair growth and removes accumulated impurities. It is both therapeutic and aesthetic.",
          },
          {
            q: "Can I give a service as a gift?",
            a: "Yes! Our services can be given as gift vouchers. Contact us to find out how to purchase a personalised voucher.",
          },
        ],
      },
      {
        title: "Products & Home Care",
        items: [
          {
            q: "Does LOMA sell professional products?",
            a: "Yes. In our online shop and at the salon you can find a selection of professional products used in our treatments, so you can maintain results at home.",
          },
          {
            q: "Do I receive home care guidance?",
            a: "Always. At the end of every service, our team shares a personalised home care routine, adapted to your hair and the treatment performed.",
          },
        ],
      },
      {
        title: "Client Care",
        items: [
          {
            q: "Is the first assessment included?",
            a: "Yes. We always carry out an initial consultation at no extra cost to understand your hair needs and recommend the most suitable protocol.",
          },
          {
            q: "Does LOMA only serve women?",
            a: "No. We welcome all genders. Our space is inclusive and our services are adapted to any hair type.",
          },
          {
            q: "Can I bring someone with me?",
            a: "Of course. The space was designed to be welcoming. Companions are always welcome, ensuring everyone's comfort.",
          },
        ],
      },
    ],
  },
};
