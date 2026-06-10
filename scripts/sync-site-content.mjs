import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { Client } from "pg";
import ts from "typescript";

const projectRoot = process.cwd();

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

function loadLocale(locale) {
  const filePath = path.join(projectRoot, "src", "i18n", `${locale}.ts`);
  const source = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const context = { exports: {}, module: { exports: {} } };

  vm.runInNewContext(output, context, { filename: filePath });
  return context.exports[locale] ?? context.module.exports[locale];
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const env = { ...readEnv(), ...process.env };
const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required in .env");
  process.exit(1);
}

const pt = loadLocale("pt");
const en = loadLocale("en");
const fr = loadLocale("fr");

const client = new Client({
  connectionString: databaseUrl,
  ssl:
    databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
});

await client.connect();

let syncedCategories = 0;
let syncedServices = 0;
let syncedProfessionals = 0;
let syncedSpaces = 0;

const ptCategories = pt.services.categories;
const enCategories = en.services.categories;
const frCategories = fr.services.categories;

for (const [categoryIndex, category] of ptCategories.entries()) {
  const enCategory = enCategories[categoryIndex] ?? {};
  const frCategory = frCategories[categoryIndex] ?? {};

  const categoryResult = await client.query(
    `
      insert into service_categories (
        slug,
        name_pt,
        name_en,
        name_fr,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, true, $5)
      on conflict (slug) do update
      set
        name_pt = excluded.name_pt,
        name_en = excluded.name_en,
        name_fr = excluded.name_fr,
        is_visible = true,
        sort_order = excluded.sort_order
      returning id
    `,
    [category.slug, category.name, enCategory.name ?? null, frCategory.name ?? null, categoryIndex],
  );

  const categoryId = categoryResult.rows[0].id;
  syncedCategories += 1;

  for (const [serviceIndex, service] of category.items.entries()) {
    const enService = enCategory.items?.[serviceIndex] ?? {};
    const frService = frCategory.items?.[serviceIndex] ?? {};
    const serviceSlug = `${category.slug}-${slugify(service.name)}`;

    await client.query(
      `
        insert into services (
          category_id,
          slug,
          name_pt,
          name_en,
          name_fr,
          description_pt,
          description_en,
          description_fr,
          price_label,
          duration_label,
          is_featured,
          is_visible,
          sort_order
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, $12)
        on conflict (slug) do update
        set
          category_id = excluded.category_id,
          name_pt = excluded.name_pt,
          name_en = excluded.name_en,
          name_fr = excluded.name_fr,
          description_pt = excluded.description_pt,
          description_en = excluded.description_en,
          description_fr = excluded.description_fr,
          price_label = excluded.price_label,
          duration_label = excluded.duration_label,
          is_featured = excluded.is_featured,
          is_visible = true,
          sort_order = excluded.sort_order
      `,
      [
        categoryId,
        serviceSlug,
        service.name,
        enService.name ?? null,
        frService.name ?? null,
        service.desc,
        enService.desc ?? null,
        frService.desc ?? null,
        service.price,
        service.time,
        category.slug === "featured",
        categoryIndex * 100 + serviceIndex,
      ],
    );

    syncedServices += 1;
  }
}

for (const [index, name] of pt.booking.professionals.entries()) {
  const existing = await client.query("select id from professionals where name = $1 limit 1", [
    name,
  ]);

  if (existing.rows[0]) {
    await client.query(
      `
        update professionals
        set is_visible = true, sort_order = $2
        where id = $1
      `,
      [existing.rows[0].id, index],
    );
  } else {
    await client.query(
      `
        insert into professionals (name, is_visible, sort_order)
        values ($1, true, $2)
      `,
      [name, index],
    );
  }

  syncedProfessionals += 1;
}

const ptSpaces = pt.pros.spaces;
const enSpaces = en.pros.spaces;
const frSpaces = fr.pros.spaces;

for (const [index, space] of ptSpaces.entries()) {
  const enSpace = enSpaces[index] ?? {};
  const frSpace = frSpaces[index] ?? {};
  const slug = slugify(space.n);

  await client.query(
    `
      insert into professional_spaces (
        slug,
        name_pt,
        name_en,
        name_fr,
        description_pt,
        description_en,
        description_fr,
        benefits_pt,
        benefits_en,
        benefits_fr,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, true, $11)
      on conflict (slug) do update
      set
        name_pt = excluded.name_pt,
        name_en = excluded.name_en,
        name_fr = excluded.name_fr,
        description_pt = excluded.description_pt,
        description_en = excluded.description_en,
        description_fr = excluded.description_fr,
        benefits_pt = excluded.benefits_pt,
        benefits_en = excluded.benefits_en,
        benefits_fr = excluded.benefits_fr,
        is_visible = true,
        sort_order = excluded.sort_order
    `,
    [
      slug,
      space.n,
      enSpace.n ?? null,
      frSpace.n ?? null,
      space.d,
      enSpace.d ?? null,
      frSpace.d ?? null,
      JSON.stringify(space.b ?? []),
      JSON.stringify(enSpace.b ?? []),
      JSON.stringify(frSpace.b ?? []),
      index,
    ],
  );

  syncedSpaces += 1;
}

await client.end();

console.log(
  `Synced ${syncedCategories} service categories, ${syncedServices} services, ${syncedProfessionals} professionals and ${syncedSpaces} professional spaces.`,
);
