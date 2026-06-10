import shampoo from "@/assets/product-shampoo.jpg";
import mask from "@/assets/lomaproducts/mascara1.webp";
import oil from "@/assets/product-oil.jpg";
import kit from "@/assets/product-kit.jpg";
import cream from "@/assets/product-cream.jpg";
import spray from "@/assets/product-spray.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  cat: "styling" | "cronograma" | "cuidado";
  descPt: string;
  descEn: string;
  descFr: string;
}

export const products: Product[] = [
  // 0
  {
    id: "shampoo-hidratante",
    name: "Shampoo Hidratante",
    price: 28,
    image: shampoo,
    cat: "cuidado",
    descPt: "Limpeza suave com hidratação profunda para fios secos e quebradiços.",
    descEn: "Gentle cleansing with deep hydration for dry and brittle hair.",
    descFr: "Nettoyage doux avec hydratation profonde pour cheveux secs et cassants.",
  },
  // 1
  {
    id: "mascara-reparadora",
    name: "Máscara Reparadora",
    price: 42,
    image: mask,
    cat: "cronograma",
    descPt: "Tratamento intensivo que reconstrói a estrutura capilar e devolve o brilho.",
    descEn: "Intensive treatment that rebuilds hair structure and restores shine.",
    descFr: "Traitement intensif qui reconstruit la structure capillaire et redonne de l'éclat.",
  },
  // 2
  {
    id: "oleo-reparador",
    name: "Óleo Reparador",
    price: 38,
    image: oil,
    cat: "cuidado",
    descPt: "Óleo multifuncional que sela as cutículas e protege os fios do calor.",
    descEn: "Multifunctional oil that seals cuticles and protects hair from heat.",
    descFr: "Huile multifonctionnelle qui scelle les cuticules et protège contre la chaleur.",
  },
  // 3
  {
    id: "creme-leave-in",
    name: "Creme Leave-in",
    price: 32,
    image: cream,
    cat: "cuidado",
    descPt: "Creme sem enxague que controla o frizz e facilita o penteado.",
    descEn: "Leave-in cream that controls frizz and makes styling easier.",
    descFr: "Crème sans rinçage qui contrôle le frizz et facilite le coiffage.",
  },
  // 4
  {
    id: "spray-texturizante",
    name: "Spray Texturizante",
    price: 26,
    image: spray,
    cat: "styling",
    descPt: "Spray de acabamento que cria textura e volume com fixação leve.",
    descEn: "Finishing spray that creates texture and volume with light hold.",
    descFr: "Spray de finition qui crée de la texture et du volume avec une fixation légère.",
  },
  // 5
  {
    id: "kit-tratamento",
    name: "Kit Tratamento Completo",
    price: 120,
    image: kit,
    cat: "cronograma",
    descPt: "Kit completo com shampoo, máscara e óleo para um cronograma capilar profissional.",
    descEn: "Complete kit with shampoo, mask and oil for a professional hair care routine.",
    descFr:
      "Kit complet avec shampooing, masque et huile pour un calendrier capillaire professionnel.",
  },

  // 6
  {
    id: "shampoo-reconstrutor",
    name: "Shampoo Reconstrutor",
    price: 30,
    image: shampoo,
    cat: "cronograma",
    descPt: "Limpeza reconstrutora que fortalece os fios fragilizados desde a primeira lavagem.",
    descEn: "Reconstructing cleanser that strengthens fragile hair from the first wash.",
    descFr: "Nettoyant reconstituant qui renforce les cheveux fragilisés dès le premier lavage.",
  },
  // 7
  {
    id: "mascara-nutritiva",
    name: "Máscara Nutritiva",
    price: 45,
    image: mask,
    cat: "cuidado",
    descPt: "Nutrição profunda com manteiga de karité para fios muito secos.",
    descEn: "Deep nourishment with shea butter for very dry hair.",
    descFr: "Nutrition profonde au beurre de karité pour les cheveux très secs.",
  },
  // 8
  {
    id: "oleo-argao",
    name: "Óleo de Argão",
    price: 40,
    image: oil,
    cat: "cuidado",
    descPt: "Óleo puro de argão para um brilho intenso e maciez duradoura.",
    descEn: "Pure argan oil for intense shine and long-lasting softness.",
    descFr: "Huile d'argan pure pour un éclat intense et une douceur durable.",
  },
  // 9
  {
    id: "spray-protetor-calor",
    name: "Spray Protetor de Calor",
    price: 29,
    image: spray,
    cat: "styling",
    descPt: "Proteção térmica até 230°C para uso com secador e chapinha.",
    descEn: "Thermal protection up to 230°C for use with hairdryer and straightener.",
    descFr: "Protection thermique jusqu'à 230°C pour l'utilisation avec sèche-cheveux et lisseur.",
  },
  // 10
  {
    id: "creme-modelador",
    name: "Creme Modelador",
    price: 34,
    image: cream,
    cat: "styling",
    descPt: "Definição e controlo do crespo com acabamento sedoso.",
    descEn: "Definition and frizz control with a silky finish.",
    descFr: "Définition et contrôle du frisottis avec une finition soyeuse.",
  },
  // 11
  {
    id: "kit-loiro",
    name: "Kit Loiro Perfeito",
    price: 98,
    image: kit,
    cat: "cronograma",
    descPt: "Shampoo matizador, máscara violeta e óleo para loiros impecáveis em casa.",
    descEn: "Toning shampoo, purple mask and oil for impeccable blondes at home.",
    descFr:
      "Shampooing tonifiant, masque violet et huile pour des blondes impeccables à la maison.",
  },

  // 12
  {
    id: "shampoo-anticaspa",
    name: "Shampoo Anti-Caspa",
    price: 27,
    image: shampoo,
    cat: "cuidado",
    descPt: "Fórmula clínica que combate a caspa e purifica o couro cabeludo.",
    descEn: "Clinical formula that fights dandruff and purifies the scalp.",
    descFr: "Formule clinique qui combat les pellicules et purifie le cuir chevelu.",
  },
  // 13
  {
    id: "mascara-matizadora",
    name: "Máscara Matizadora",
    price: 39,
    image: mask,
    cat: "cuidado",
    descPt: "Neutraliza tons amarelados e prolonga a vida de loiros e mechas.",
    descEn: "Neutralises yellow tones and prolongs the life of blondes and highlights.",
    descFr: "Neutralise les tons jaunâtres et prolonge la durée de vie des blondes et des mèches.",
  },
  // 14
  {
    id: "oleo-copaiba",
    name: "Óleo de Copaíba",
    price: 36,
    image: oil,
    cat: "cronograma",
    descPt: "Selagem cuticula com copaíba para fios com brilho e leveza.",
    descEn: "Cuticle sealing with copaiba for shiny and lightweight hair.",
    descFr: "Scellage de cuticule à la copaïba pour des cheveux brillants et légers.",
  },
  // 15
  {
    id: "spray-volume",
    name: "Spray de Volume",
    price: 25,
    image: spray,
    cat: "styling",
    descPt: "Levanta e dá corpo aos fios sem pesar, ideal para finalizações.",
    descEn: "Lifts and adds body without weighing hair down, ideal for finishing.",
    descFr: "Soulève et donne du corps sans alourdir, idéal pour le coiffage final.",
  },
  // 16
  {
    id: "creme-pentear",
    name: "Creme de Pentear",
    price: 31,
    image: cream,
    cat: "styling",
    descPt: "Facilita o penteado e reduz o tempo de secagem com efeito anti-frizz.",
    descEn: "Eases styling and reduces drying time with anti-frizz effect.",
    descFr: "Facilite le coiffage et réduit le temps de séchage avec effet anti-frisottis.",
  },
  // 17
  {
    id: "kit-progressiva",
    name: "Kit Pós-Progressiva",
    price: 85,
    image: kit,
    cat: "cronograma",
    descPt: "Shampoo e máscara para manter o alisamento e a saúde capilar por mais tempo.",
    descEn: "Shampoo and mask to maintain straightening and hair health for longer.",
    descFr: "Shampooing et masque pour maintenir le lissage et la santé capillaire plus longtemps.",
  },
  // 18
  {
    id: "shampoo-cachos",
    name: "Shampoo para Cachos",
    price: 29,
    image: shampoo,
    cat: "cuidado",
    descPt: "Higienização suave que respeita os cachos e mantém a hidratação natural.",
    descEn: "Gentle cleansing that respects curls and maintains natural hydration.",
    descFr: "Nettoyage doux qui respecte les boucles et maintient l'hydratation naturelle.",
  },
  // 19
  {
    id: "mascara-cacho-perfeito",
    name: "Máscara Cacho Perfeito",
    price: 44,
    image: mask,
    cat: "cronograma",
    descPt: "Define e hidrata os cachos com memória e elasticidade por dias.",
    descEn: "Defines and hydrates curls with memory and elasticity for days.",
    descFr: "Définit et hydrate les boucles avec mémoire et élasticité pendant des jours.",
  },
  // 20
  {
    id: "oleo-macadamia",
    name: "Óleo de Macadâmia",
    price: 37,
    image: oil,
    cat: "cuidado",
    descPt: "Ácidos gordos de macadâmia para fios com maciez e flexibilidade.",
    descEn: "Macadamia fatty acids for soft and flexible hair.",
    descFr: "Acides gras de macadamia pour des cheveux doux et flexibles.",
  },
  // 21
  {
    id: "spray-brilho",
    name: "Spray de Brilho",
    price: 23,
    image: spray,
    cat: "styling",
    descPt: "Toque final de espelho para qualquer tipo de cabelo.",
    descEn: "Mirror-finish final touch for any hair type.",
    descFr: "Touche finale effet miroir pour tout type de cheveux.",
  },
  // 22
  {
    id: "creme-hidratante-cachos",
    name: "Creme Hidratante Cachos",
    price: 33,
    image: cream,
    cat: "cuidado",
    descPt: "Hidratação diária para cachos com definição e leveza.",
    descEn: "Daily hydration for curls with definition and lightness.",
    descFr: "Hydratation quotidienne pour les boucles avec définition et légèreté.",
  },
  // 23
  {
    id: "kit-hidratacao",
    name: "Kit Hidratação Intensiva",
    price: 110,
    image: kit,
    cat: "cronograma",
    descPt: "Protocolo completo de hidratação com shampoo, máscara e finalizador.",
    descEn: "Complete hydration protocol with shampoo, mask and finisher.",
    descFr: "Protocole d'hydratation complet avec shampooing, masque et finisseur.",
  },
  // 24
  {
    id: "shampoo-coloridos",
    name: "Shampoo para Coloridos",
    price: 31,
    image: shampoo,
    cat: "cuidado",
    descPt: "Preserva a cor e o brilho dos cabelos coloridos ou com mechas.",
    descEn: "Preserves the colour and shine of dyed or highlighted hair.",
    descFr: "Préserve la couleur et l'éclat des cheveux colorés ou méchés.",
  },
  // 25
  {
    id: "mascara-botox-capilar",
    name: "Máscara Botox Capilar",
    price: 55,
    image: mask,
    cat: "cronograma",
    descPt: "Preenchimento das fibras capilares com efeito alisador suave e brilho intenso.",
    descEn: "Fills hair fibres with a gentle straightening effect and intense shine.",
    descFr: "Remplit les fibres capillaires avec un effet lissant doux et un éclat intense.",
  },
  // 26
  {
    id: "oleo-ceratina",
    name: "Óleo de Queratina",
    price: 42,
    image: oil,
    cat: "cronograma",
    descPt: "Reposição de queratina para fios danificados com acabamento liso e sedoso.",
    descEn: "Keratin replenishment for damaged hair with a smooth and silky finish.",
    descFr:
      "Reconstitution de kératine pour les cheveux abîmés avec une finition lisse et soyeuse.",
  },

  // 27
  {
    id: "spray-fixador",
    name: "Spray Fixador",
    price: 22,
    image: spray,
    cat: "styling",
    descPt: "Fixação forte com acabamento natural para penteados duradouros.",
    descEn: "Strong hold with a natural finish for long-lasting hairstyles.",
    descFr: "Tenue forte avec une finition naturelle pour des coiffures durables.",
  },
  // 28
  {
    id: "creme-anti-frizz",
    name: "Creme Anti-Frizz",
    price: 35,
    image: cream,
    cat: "styling",
    descPt: "Controlo total do frizz com efeito desumidificante que dura o dia todo.",
    descEn: "Total frizz control with dehumidifying effect that lasts all day.",
    descFr: "Contrôle total du frisottis avec effet déshumidifiant qui dure toute la journée.",
  },
];
