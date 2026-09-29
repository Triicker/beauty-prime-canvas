import "@tanstack/react-start/server-only";

import { query, queryOne } from "./db.server";

export type MarketingSlideInput = {
  slug: string;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
  imageUrl: string;
  altText?: string | null;
  isVisible: boolean;
  sortOrder: number;
};

export type MarketingSlideRecord = MarketingSlideInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type MarketingSlideRow = {
  id: string;
  slug: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  imageUrl: string;
  altText: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

const marketingSlideSelect = `
  select
    id,
    slug,
    eyebrow,
    title,
    description,
    button_label as "buttonLabel",
    button_href as "buttonHref",
    image_url as "imageUrl",
    alt_text as "altText",
    is_visible as "isVisible",
    sort_order as "sortOrder",
    created_at::text as "createdAt",
    updated_at::text as "updatedAt"
  from marketing_slides
`;

function normalizeNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function slugifyMarketingSlide(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeSlide(row: MarketingSlideRow): MarketingSlideRecord {
  return row;
}

export async function listPublicMarketingSlides() {
  const rows = await query<MarketingSlideRow>(
    `
      ${marketingSlideSelect}
      where is_visible = true
      order by sort_order, title
    `,
  );

  return rows.map(normalizeSlide);
}

export async function listAdminMarketingSlides() {
  const rows = await query<MarketingSlideRow>(
    `
      ${marketingSlideSelect}
      order by sort_order, title
    `,
  );

  return rows.map(normalizeSlide);
}

export async function createMarketingSlide(input: MarketingSlideInput) {
  const slug = input.slug?.trim() || slugifyMarketingSlide(input.title);

  const row = await queryOne<MarketingSlideRow>(
    `
      insert into marketing_slides (
        slug,
        eyebrow,
        title,
        description,
        button_label,
        button_href,
        image_url,
        alt_text,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning
        id,
        slug,
        eyebrow,
        title,
        description,
        button_label as "buttonLabel",
        button_href as "buttonHref",
        image_url as "imageUrl",
        alt_text as "altText",
        is_visible as "isVisible",
        sort_order as "sortOrder",
        created_at::text as "createdAt",
        updated_at::text as "updatedAt"
    `,
    [
      slug,
      normalizeNullable(input.eyebrow),
      input.title.trim(),
      normalizeNullable(input.description),
      normalizeNullable(input.buttonLabel),
      normalizeNullable(input.buttonHref),
      input.imageUrl.trim(),
      normalizeNullable(input.altText),
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) throw new Error("Marketing slide was not created");
  return normalizeSlide(row);
}

export async function updateMarketingSlide(id: string, input: MarketingSlideInput) {
  const slug = input.slug?.trim() || slugifyMarketingSlide(input.title);

  const row = await queryOne<MarketingSlideRow>(
    `
      update marketing_slides
      set
        slug = $2,
        eyebrow = $3,
        title = $4,
        description = $5,
        button_label = $6,
        button_href = $7,
        image_url = $8,
        alt_text = $9,
        is_visible = $10,
        sort_order = $11
      where id = $1
      returning
        id,
        slug,
        eyebrow,
        title,
        description,
        button_label as "buttonLabel",
        button_href as "buttonHref",
        image_url as "imageUrl",
        alt_text as "altText",
        is_visible as "isVisible",
        sort_order as "sortOrder",
        created_at::text as "createdAt",
        updated_at::text as "updatedAt"
    `,
    [
      id,
      slug,
      normalizeNullable(input.eyebrow),
      input.title.trim(),
      normalizeNullable(input.description),
      normalizeNullable(input.buttonLabel),
      normalizeNullable(input.buttonHref),
      input.imageUrl.trim(),
      normalizeNullable(input.altText),
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) return null;
  return normalizeSlide(row);
}

export async function deleteMarketingSlide(id: string) {
  await query("delete from marketing_slides where id = $1", [id]);
}
