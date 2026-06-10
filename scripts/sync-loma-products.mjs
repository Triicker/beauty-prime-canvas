import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const projectRoot = process.cwd();
const productsDir = path.join(projectRoot, "src", "assets", "lomaproducts");
const publicBaseUrl = "https://midiasave-5c064.web.app";

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

function productName(rule, filename) {
  const slug = slugFromFilename(filename);
  const n = numberFromSlug(slug);
  return `${rule.name} ${n}`;
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
      rule.price,
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
