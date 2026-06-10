import "@tanstack/react-start/server-only";

import { query, queryOne } from "./db.server";

export type ProductInput = {
  slug: string;
  namePt: string;
  nameEn?: string | null;
  nameFr?: string | null;
  descriptionPt?: string | null;
  descriptionEn?: string | null;
  descriptionFr?: string | null;
  price?: number | null;
  category?: string | null;
  categories?: string[];
  imageUrl?: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export type ProductRecord = Omit<ProductInput, "categories"> & {
  id: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
};

type ProductRow = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string | null;
  nameFr: string | null;
  descriptionPt: string | null;
  descriptionEn: string | null;
  descriptionFr: string | null;
  price: string | null;
  category: string | null;
  categories: string[] | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function normalizeProduct(row: ProductRow): ProductRecord {
  const categories =
    row.categories && row.categories.length > 0
      ? row.categories
      : row.category
        ? [row.category]
        : [];

  return {
    ...row,
    categories,
    category: row.category ?? categories[0] ?? null,
    price: row.price == null ? null : Number(row.price),
  };
}

function normalizeNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeCategories(input: ProductInput) {
  const categories = (input.categories ?? []).map((category) => category.trim()).filter(Boolean);

  if (categories.length > 0) return Array.from(new Set(categories));

  const fallback = normalizeNullable(input.category);
  return fallback ? [fallback] : [];
}

export function slugifyProductName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const productSelect = `
  select
    id,
    slug,
    name_pt as "namePt",
    name_en as "nameEn",
    name_fr as "nameFr",
    description_pt as "descriptionPt",
    description_en as "descriptionEn",
    description_fr as "descriptionFr",
    price,
    category,
    categories,
    image_url as "imageUrl",
    is_featured as "isFeatured",
    is_visible as "isVisible",
    sort_order as "sortOrder",
    created_at::text as "createdAt",
    updated_at::text as "updatedAt"
  from products
`;

export async function listPublicProducts() {
  const rows = await query<ProductRow>(
    `
      ${productSelect}
      where is_visible = true
      order by sort_order, name_pt
    `,
  );

  return rows.map(normalizeProduct);
}

export async function listAdminProducts() {
  const rows = await query<ProductRow>(
    `
      ${productSelect}
      order by sort_order, name_pt
    `,
  );

  return rows.map(normalizeProduct);
}

export async function createProduct(input: ProductInput) {
  const slug = input.slug?.trim() || slugifyProductName(input.namePt);
  const categories = normalizeCategories(input);
  const category = normalizeNullable(input.category) ?? categories[0] ?? null;

  const row = await queryOne<ProductRow>(
    `
      insert into products (
        slug,
        name_pt,
        name_en,
        name_fr,
        description_pt,
        description_en,
        description_fr,
        price,
        category,
        categories,
        image_url,
        is_featured,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      returning
        id,
        slug,
        name_pt as "namePt",
        name_en as "nameEn",
        name_fr as "nameFr",
        description_pt as "descriptionPt",
        description_en as "descriptionEn",
        description_fr as "descriptionFr",
        price,
        category,
        categories,
        image_url as "imageUrl",
        is_featured as "isFeatured",
        is_visible as "isVisible",
        sort_order as "sortOrder",
        created_at::text as "createdAt",
        updated_at::text as "updatedAt"
    `,
    [
      slug,
      input.namePt.trim(),
      normalizeNullable(input.nameEn),
      normalizeNullable(input.nameFr),
      normalizeNullable(input.descriptionPt),
      normalizeNullable(input.descriptionEn),
      normalizeNullable(input.descriptionFr),
      input.price,
      category,
      categories,
      normalizeNullable(input.imageUrl),
      input.isFeatured,
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) throw new Error("Product was not created");
  return normalizeProduct(row);
}

export async function updateProduct(id: string, input: ProductInput) {
  const slug = input.slug?.trim() || slugifyProductName(input.namePt);
  const categories = normalizeCategories(input);
  const category = normalizeNullable(input.category) ?? categories[0] ?? null;

  const row = await queryOne<ProductRow>(
    `
      update products
      set
        slug = $2,
        name_pt = $3,
        name_en = $4,
        name_fr = $5,
        description_pt = $6,
        description_en = $7,
        description_fr = $8,
        price = $9,
        category = $10,
        categories = $11,
        image_url = $12,
        is_featured = $13,
        is_visible = $14,
        sort_order = $15
      where id = $1
      returning
        id,
        slug,
        name_pt as "namePt",
        name_en as "nameEn",
        name_fr as "nameFr",
        description_pt as "descriptionPt",
        description_en as "descriptionEn",
        description_fr as "descriptionFr",
        price,
        category,
        categories,
        image_url as "imageUrl",
        is_featured as "isFeatured",
        is_visible as "isVisible",
        sort_order as "sortOrder",
        created_at::text as "createdAt",
        updated_at::text as "updatedAt"
    `,
    [
      id,
      slug,
      input.namePt.trim(),
      normalizeNullable(input.nameEn),
      normalizeNullable(input.nameFr),
      normalizeNullable(input.descriptionPt),
      normalizeNullable(input.descriptionEn),
      normalizeNullable(input.descriptionFr),
      input.price,
      category,
      categories,
      normalizeNullable(input.imageUrl),
      input.isFeatured,
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) return null;
  return normalizeProduct(row);
}

export async function deleteProduct(id: string) {
  await query("delete from products where id = $1", [id]);
}
