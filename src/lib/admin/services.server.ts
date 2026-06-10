import "@tanstack/react-start/server-only";

import { query, queryOne } from "./db.server";

export type ServiceCategoryRecord = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string | null;
  nameFr: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ServiceInput = {
  categoryId?: string | null;
  slug: string;
  namePt: string;
  nameEn?: string | null;
  nameFr?: string | null;
  descriptionPt?: string | null;
  descriptionEn?: string | null;
  descriptionFr?: string | null;
  priceLabel?: string | null;
  durationLabel?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export type ServiceRecord = ServiceInput & {
  id: string;
  categorySlug: string | null;
  categoryNamePt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicServiceCategory = ServiceCategoryRecord & {
  services: ServiceRecord[];
};

type ServiceCategoryRow = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string | null;
  nameFr: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ServiceRow = {
  id: string;
  categoryId: string | null;
  categorySlug: string | null;
  categoryNamePt: string | null;
  slug: string;
  namePt: string;
  nameEn: string | null;
  nameFr: string | null;
  descriptionPt: string | null;
  descriptionEn: string | null;
  descriptionFr: string | null;
  priceLabel: string | null;
  durationLabel: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function normalizeNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function slugifyContent(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const categorySelect = `
  select
    id,
    slug,
    name_pt as "namePt",
    name_en as "nameEn",
    name_fr as "nameFr",
    is_visible as "isVisible",
    sort_order as "sortOrder",
    created_at::text as "createdAt",
    updated_at::text as "updatedAt"
  from service_categories
`;

const serviceSelect = `
  select
    s.id,
    s.category_id as "categoryId",
    c.slug as "categorySlug",
    c.name_pt as "categoryNamePt",
    s.slug,
    s.name_pt as "namePt",
    s.name_en as "nameEn",
    s.name_fr as "nameFr",
    s.description_pt as "descriptionPt",
    s.description_en as "descriptionEn",
    s.description_fr as "descriptionFr",
    s.price_label as "priceLabel",
    s.duration_label as "durationLabel",
    s.image_url as "imageUrl",
    s.is_featured as "isFeatured",
    s.is_visible as "isVisible",
    s.sort_order as "sortOrder",
    s.created_at::text as "createdAt",
    s.updated_at::text as "updatedAt"
  from services s
  left join service_categories c on c.id = s.category_id
`;

export async function listServiceCategories({ includeHidden = false } = {}) {
  return query<ServiceCategoryRow>(
    `
      ${categorySelect}
      ${includeHidden ? "" : "where is_visible = true"}
      order by sort_order, name_pt
    `,
  );
}

export async function listPublicServiceCategories() {
  const [categories, services] = await Promise.all([
    listServiceCategories(),
    query<ServiceRow>(
      `
        ${serviceSelect}
        where s.is_visible = true
          and (c.id is null or c.is_visible = true)
        order by coalesce(c.sort_order, 9999), s.sort_order, s.name_pt
      `,
    ),
  ]);

  const grouped = new Map<string, PublicServiceCategory>();

  for (const category of categories) {
    grouped.set(category.id, { ...category, services: [] });
  }

  for (const service of services) {
    if (service.categoryId && grouped.has(service.categoryId)) {
      grouped.get(service.categoryId)?.services.push(service);
    }
  }

  return Array.from(grouped.values()).filter((category) => category.services.length > 0);
}

export async function listAdminServices() {
  return query<ServiceRow>(
    `
      ${serviceSelect}
      order by coalesce(c.sort_order, 9999), s.sort_order, s.name_pt
    `,
  );
}

export async function createService(input: ServiceInput) {
  const slug = input.slug?.trim() || slugifyContent(input.namePt);

  const row = await queryOne<ServiceRow>(
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
        image_url,
        is_featured,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      returning
        id,
        category_id as "categoryId",
        null::text as "categorySlug",
        null::text as "categoryNamePt",
        slug,
        name_pt as "namePt",
        name_en as "nameEn",
        name_fr as "nameFr",
        description_pt as "descriptionPt",
        description_en as "descriptionEn",
        description_fr as "descriptionFr",
        price_label as "priceLabel",
        duration_label as "durationLabel",
        image_url as "imageUrl",
        is_featured as "isFeatured",
        is_visible as "isVisible",
        sort_order as "sortOrder",
        created_at::text as "createdAt",
        updated_at::text as "updatedAt"
    `,
    [
      normalizeNullable(input.categoryId),
      slug,
      input.namePt.trim(),
      normalizeNullable(input.nameEn),
      normalizeNullable(input.nameFr),
      normalizeNullable(input.descriptionPt),
      normalizeNullable(input.descriptionEn),
      normalizeNullable(input.descriptionFr),
      normalizeNullable(input.priceLabel),
      normalizeNullable(input.durationLabel),
      normalizeNullable(input.imageUrl),
      input.isFeatured,
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) throw new Error("Service was not created");
  return getService(row.id);
}

export async function updateService(id: string, input: ServiceInput) {
  const slug = input.slug?.trim() || slugifyContent(input.namePt);

  const row = await queryOne<{ id: string }>(
    `
      update services
      set
        category_id = $2,
        slug = $3,
        name_pt = $4,
        name_en = $5,
        name_fr = $6,
        description_pt = $7,
        description_en = $8,
        description_fr = $9,
        price_label = $10,
        duration_label = $11,
        image_url = $12,
        is_featured = $13,
        is_visible = $14,
        sort_order = $15
      where id = $1
      returning id
    `,
    [
      id,
      normalizeNullable(input.categoryId),
      slug,
      input.namePt.trim(),
      normalizeNullable(input.nameEn),
      normalizeNullable(input.nameFr),
      normalizeNullable(input.descriptionPt),
      normalizeNullable(input.descriptionEn),
      normalizeNullable(input.descriptionFr),
      normalizeNullable(input.priceLabel),
      normalizeNullable(input.durationLabel),
      normalizeNullable(input.imageUrl),
      input.isFeatured,
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) return null;
  return getService(row.id);
}

export async function getService(id: string) {
  return queryOne<ServiceRow>(
    `
      ${serviceSelect}
      where s.id = $1
    `,
    [id],
  );
}

export async function deleteService(id: string) {
  await query("delete from services where id = $1", [id]);
}
