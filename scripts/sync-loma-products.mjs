import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const projectRoot = process.cwd();
const productsDir = path.join(projectRoot, "src", "assets", "lomaproducts");
const publicBaseUrl = "https://midiasave-5c064.web.app";

const avaniProductCatalog = {
  shampoo1: {
    name: "Shampoo Vitaminado Fortificante Indian Hair 250 ml | Sem Sal",
    price: 21.89,
  },
  shampoo2: {
    name: "Shampoo Vitaminado Fortificante Indian Hair 500 ml | Sem sal",
    price: 38.39,
  },
  shampoo3: {
    name: "Shampoo Purificante Cold Effect 250 ml | Sem Sal",
    price: 24.75,
  },
  shampoo4: {
    name: "Shampoo Reconstrutor Indian Hair Rebuild 250ml | Sem Sal",
    price: 26.9,
  },
  shampoo5: {
    name: "Shampoo Nutritivo Indian Hair Nutrition 250 ml | Sem Sal",
    price: 21.89,
  },
  shampoo6: {
    name: "Shampoo fortificante e apaziguador com Açafrão Panchali 250 ml | Sem Sal",
    price: 25.19,
  },
  shampoo7: {
    name: "Shampoo Purificante Cold Effect 500 ml | Sem Sal",
    price: 43.89,
  },
  shampoo8: {
    name: "Shampoo Nutritivo Indian Hair Nutrition 500 ml | Sem Sal",
    price: 38.39,
  },
  shampoo9: {
    name: "Shampoo Pouca Espuma Krishna Curls 250 ml | Sem Sal",
    price: 25.19,
  },
  shampoo10: {
    name: "Shampoo Reconstrutor Indian Hair Rebuild 500ml | Sem Sal",
    price: 49.9,
  },
  shampoo11: {
    name: "Shampoo fortificante e apaziguador com Açafrão Panchali 500 ml | Vegan",
    price: 43.89,
  },
  shampoo12: {
    name: "Shampoo Black Platinum Pro 250 ml | Neutralizante Amarelos e Grisalhos",
    price: 21.89,
  },
  shampoo13: {
    name: "Co Wash Krishna Curls | Lavagem Hidratante Sem Espuma | 250 ml",
    price: 32.89,
  },
  shampoo14: {
    name: "Shampoo Krishna Curls | Caracóis Naturais | Pouca Espuma 500ml",
    price: 43.89,
  },
  shampoo15: {
    name: "Shampoo Vitaminado Fortificante Indian Hair 5 L | Sem sal",
    price: 218.9,
  },
  shampoo16: {
    name: "Shampoo Black Platinum Pro 500 ml | Neutralizante Amarelos e Grisalhos",
    price: 39.4,
  },
  shampoo17: {
    name: "Co Wash Krishna Curls | Lavagem Hidratante Sem Espuma | 500ml",
    price: 63.81,
  },
  mascara1: {
    name: "Máscara Vitaminada Indian Hair 500 ml | Hidratante",
    price: 32.89,
  },
  mascara2: {
    name: "Máscara Indian Hair Rebuild 500 ml | Reconstrutora",
    price: 49.9,
  },
  mascara3: {
    name: "Máscara Indian Hair Nutrition 500 ml | Nutritiva",
    price: 38.39,
  },
  mascara4: {
    name: "Máscara Indian Hair Nutrition Spider Web 500 ml | Nutritiva Leve",
    price: 43.89,
  },
  mascara5: {
    name: "Máscara Panchali 500 ml | Hidratante & Fortificante | Açafrão Biológico",
    price: 43.89,
  },
  mascara6: {
    name: "Creme Purificante especial Couro Cabeludo 500 ml | Hamamélis",
    price: 32.89,
  },
  mascara7: {
    name: "Máscara Krishna Curls 500 ml | Nutrição Profunda",
    price: 43.89,
  },
  mascara8: {
    name: "Máscara Black Platinum Pro 500 ml | Neutralizante Amarelos e Grisalhos",
    price: 43.89,
  },
  condicionador1: {
    name: "Condicionador Fortificante Indian Hair Vitaminado 250 ml | Sem Sal",
    price: 25.19,
  },
  condicionador2: {
    name: "Condicionador Reconstrutor Indian Hair Rebuild 250 ml | Sem Sal",
    price: 29.9,
  },
  condicionador3: {
    name: "Condicionador Nutritivo Indian Hair Nutrition 250 ml | Sem Sal",
    price: 27.39,
  },
  condicionador4: {
    name: "Condicionador Fortificante Indian Hair Vitaminado 500 ml | Sem Sal",
    price: 41.69,
  },
  condicionador5: {
    name: "Condicionador Selante Nutritivo Krishna Curls 250 ml | Sem Sal",
    price: 32.89,
  },
  condicionador6: {
    name: "Condicionador fortificante e apaziguador com Açafrão Panchali 250 ml | Vegan",
    price: 27.39,
  },
  condicionador7: {
    name: "Condicionador fortificante e apaziguador com Açafrão Panchali 500 ml | Vegan",
    price: 47.19,
  },
  condicionador8: {
    name: "Condicionador Black Platinum Pro 250 ml | Neutralizante Amarelos e Grisalhos",
    price: 27.39,
  },
  condicionador9: {
    name: "Condicionador Indian Hair Rebuild 500 ml | Reconstrutor",
    price: 56.81,
  },
  tonico: {
    name: "Tónico Capilar Vitaminado Fortificante Indian Hair 100 ml | Amla",
    price: 38.39,
  },
  creme1: {
    name: "Sérum Selador de Pontas Indian Hair Rebuild | 100ml",
    price: 29.9,
  },
  creme2: {
    name: "Modelador de Caracóis Active Curls | Creme Finalizador 250ml",
    price: 21.89,
  },
  creme3: {
    name: "Casual Waves 250ml | Geleia Texturizante Leave in",
    price: 21.89,
  },
  creme4: {
    name: "Modelador de Caracóis Active Curls | Creme Finalizador 500ml",
    price: 32.89,
  },
  creme5: {
    name: "Creme Intenso Krishna Curls | Nutrição Profunda | 250 ml",
    price: 29.59,
  },
  creme6: {
    name: "Creme Purificante especial Couro Cabeludo 500 ml | Hamamélis",
    price: 32.89,
  },
  creme7: {
    name: "Creme Intenso Krishna Curls | Nutrição Profunda | 500 ml",
    price: 43.89,
  },
  oleo1: {
    name: "Prana Oil | Óleo Fortificante para cabelos finos e médios | 115ml",
    price: 32.89,
  },
  oleo2: {
    name: "Mudra Oil | Óleo Nutritivo para Cabelos Grossos | 115ml",
    price: 32.89,
  },
  oleo3: {
    name: "Óleo de Rícino Cure 100ml | 100% Biológico",
    price: 27.39,
  },
  oleo4: {
    name: "Óleo Melaleuca Tea Tree 15ml",
    price: 21.89,
  },
  oleo5: {
    name: "Óleo de Rosa Mosqueta Puro | Virgem e Biológico | 30 ml",
    price: 32.89,
  },
  termico1: {
    name: "Protetor térmico e UV Ganesh Thermic | Leite Reparador e Anti-Frizz 240ml",
    price: 29.9,
  },
  protecaotermica1: {
    name: "Protetor térmico e UV Ganesh Thermic | Leite Reparador e Anti-Frizz 240ml",
    price: 29.9,
  },
  termico2: {
    name: "Protetor Térmico & UV Surya Thermic | Spray Bifásico 200ml",
    price: 29.59,
  },
  protecaotermica2: {
    name: "Protetor Térmico & UV Surya Thermic | Spray Bifásico 200ml",
    price: 29.59,
  },
  cera1: {
    name: "Cera Capilar Styling Wax Pro Everlasting | Fixação Extra Forte 150g",
    price: 29.9,
  },
  cera2: {
    name: "Cera Capilar Styling Wax Fresh Effect | Fixação Normal 150g",
    price: 29.9,
  },
  cera3: {
    name: "Cera Capilar Styling Wax Pro Matte Paste | Matte Fixação Forte 150g",
    price: 29.9,
  },
  cera4: {
    name: "Prenda Especial | Cera Capilar Styling Wax Pro Matte Paste",
    price: 29.9,
  },
};

const categoryRules = [
  {
    match: /^fortalecimento/i,
    name: "Fortalecimento",
    categories: ["fortalecimento-queda"],
    description: "Produto profissional para fortalecimento e cuidado contra queda de cabelo.",
    price: 34,
    order: 1000,
  },
  {
    match: /^problemas/i,
    name: "Couro Cabeludo",
    categories: ["problemas-couro-cabeludo"],
    description: "Produto profissional para cuidado do couro cabeludo e equilibrio da raiz.",
    price: 34,
    order: 1100,
  },
  {
    match: /^cabelodanificado/i,
    name: "Reparacao",
    categories: ["cabelos-danificados-reparacao", "cabelos-danificados"],
    description: "Produto profissional para reparacao de cabelos danificados.",
    price: 42,
    order: 1200,
  },
  {
    match: /^cabeloseco/i,
    name: "Nutricao",
    categories: ["cabelos-secos-nutricao"],
    description: "Produto profissional para nutricao e maciez de cabelos secos.",
    price: 38,
    order: 1300,
  },
  {
    match: /^caracois/i,
    name: "Caracois e Ondas",
    categories: ["caracois-ondas-definicao", "caracois-ondas"],
    description: "Produto profissional para definicao de caracois e ondas.",
    price: 32,
    order: 1400,
  },
  {
    match: /^grisalho/i,
    name: "Matizacao",
    categories: ["cabelos-grisalhos-brancos-louros-matizacao"],
    description: "Produto profissional para matizacao de cabelos grisalhos, brancos e louros.",
    price: 36,
    order: 1500,
  },
  {
    match: /^pontasquebradicas/i,
    name: "Pontas Quebradicas",
    categories: ["pontas-quebradicas-danificados"],
    description: "Produto profissional para pontas quebradicas e fios danificados.",
    price: 36,
    order: 1600,
  },
  {
    match: /^muitodanificados/i,
    name: "Muito Danificados",
    categories: ["cabelos-muito-danificados", "cabelos-danificados"],
    description: "Produto profissional para cabelos muito danificados.",
    price: 44,
    order: 1700,
  },
  {
    match: /^danificados/i,
    name: "Danificados",
    categories: ["cabelos-danificados", "pontas-quebradicas-danificados"],
    description: "Produto profissional para recuperar fios danificados.",
    price: 40,
    order: 1800,
  },
  {
    match: /^aspero/i,
    name: "Anti-Frizz",
    categories: ["cabelo-aspero-sem-brilho-frizz"],
    description: "Produto profissional para cabelo aspero, sem brilho e com frizz.",
    price: 37,
    order: 1900,
  },
  {
    match: /^modela(?:dores|rores)/i,
    name: "Modelador",
    categories: ["modeladores-capilares", "caracois-ondas"],
    description: "Produto profissional para modelar, definir e finalizar os fios.",
    price: 29,
    order: 2000,
  },
  {
    match: /^protecaotermica/i,
    name: "Protecao Termica",
    categories: ["protecao-termica"],
    description: "Produto profissional de protecao termica capilar.",
    price: 29,
    order: 2100,
  },
  {
    match: /^shampoo/i,
    name: "Shampoo",
    categories: ["shampoos"],
    description: "Shampoo profissional para cuidado diario dos fios.",
    price: 28,
    order: 1,
  },
  {
    match: /^mascara/i,
    name: "Mascara Capilar",
    categories: ["mascaras-capilares"],
    description: "Mascara capilar para tratamento e manutencao dos fios.",
    price: 42,
    order: 200,
  },
  {
    match: /^condicionador/i,
    name: "Condicionador",
    categories: ["condicionadores"],
    description: "Condicionador profissional para maciez, brilho e desembaraco.",
    price: 32,
    order: 300,
  },
  {
    match: /^tonico/i,
    name: "Tonico Capilar",
    categories: ["tonicos-capilares", "problemas-couro-cabeludo"],
    description: "Tonico capilar para rotina de cuidado do couro cabeludo.",
    price: 35,
    order: 400,
  },
  {
    match: /^creme/i,
    name: "Creme Capilar",
    categories: ["cremes-capilares", "modeladores-capilares"],
    description: "Creme capilar para finalizacao, nutricao e controlo dos fios.",
    price: 31,
    order: 500,
  },
  {
    match: /^oleo/i,
    name: "Oleo Capilar",
    categories: ["oleos-capilares"],
    description: "Oleo capilar para brilho, protecao e acabamento sedoso.",
    price: 38,
    order: 600,
  },
  {
    match: /^(?:termico|protecaotermica)/i,
    name: "Protecao Termica",
    categories: ["protecao-termica"],
    description: "Produto de protecao termica para secador, prancha e modeladores.",
    price: 29,
    order: 700,
  },
  {
    match: /^cera/i,
    name: "Cera Capilar",
    categories: ["ceras-capilares", "modeladores-capilares"],
    description: "Cera capilar para modelar, definir e finalizar o penteado.",
    price: 24,
    order: 800,
  },
];

function readEnv() {
  const envPath = path.join(projectRoot, ".env");
  if (!fs.existsSync(envPath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function slugFromFilename(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function numberFromSlug(slug) {
  const match = slug.match(/(\d+)$/);
  return match ? Number(match[1]) : 1;
}

function ruleFor(filename) {
  const slug = slugFromFilename(filename);
  return categoryRules.find((rule) => rule.match.test(slug));
}

function productCatalogEntry(filename) {
  return avaniProductCatalog[slugFromFilename(filename)];
}

function productName(rule, filename) {
  const catalog = productCatalogEntry(filename);
  if (catalog?.name) return catalog.name;

  const slug = slugFromFilename(filename);
  const n = numberFromSlug(slug);
  return `${rule.name} ${n}`;
}

function productPrice(rule, filename) {
  const catalog = productCatalogEntry(filename);
  return catalog?.price ?? rule.price;
}

const env = { ...readEnv(), ...process.env };
const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required in .env");
  process.exit(1);
}

const files = fs
  .readdirSync(productsDir)
  .filter((file) => /\.(webp|png|jpe?g)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

const client = new Client({
  connectionString: databaseUrl,
  ssl:
    databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
});

await client.connect();

let synced = 0;
const unmatched = [];

for (const file of files) {
  const rule = ruleFor(file);
  if (!rule) {
    unmatched.push(file);
    continue;
  }

  const slug = slugFromFilename(file);
  const number = numberFromSlug(slug);
  const imageUrl = `${publicBaseUrl}/${file}`;
  const categories = rule.categories;

  await client.query(
    `
      insert into products (
        slug,
        name_pt,
        description_pt,
        price,
        category,
        categories,
        image_url,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, $5, $6, $7, true, $8)
      on conflict (slug) do update
      set
        name_pt = excluded.name_pt,
        description_pt = excluded.description_pt,
        price = excluded.price,
        category = excluded.category,
        categories = excluded.categories,
        image_url = excluded.image_url,
        is_visible = true,
        sort_order = excluded.sort_order
    `,
    [
      slug,
      productName(rule, file),
      rule.description,
      productPrice(rule, file),
      categories[0],
      categories,
      imageUrl,
      rule.order + number,
    ],
  );

  synced += 1;
}

await client.end();

console.log(`Synced ${synced} products.`);

if (unmatched.length > 0) {
  console.log(`Skipped ${unmatched.length} unmatched files:`);
  for (const file of unmatched) console.log(`- ${file}`);
}
