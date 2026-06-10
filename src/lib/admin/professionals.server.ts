import "@tanstack/react-start/server-only";

import { query, queryOne } from "./db.server";

export type ProfessionalInput = {
  name: string;
  rolePt?: string | null;
  roleEn?: string | null;
  roleFr?: string | null;
  bioPt?: string | null;
  bioEn?: string | null;
  bioFr?: string | null;
  imageUrl?: string | null;
  isVisible: boolean;
  sortOrder: number;
};

export type ProfessionalRecord = ProfessionalInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfessionalSpaceInput = {
  slug: string;
  namePt: string;
  nameEn?: string | null;
  nameFr?: string | null;
  descriptionPt?: string | null;
  descriptionEn?: string | null;
  descriptionFr?: string | null;
  benefitsPt: string[];
  benefitsEn: string[];
  benefitsFr: string[];
  imageUrl?: string | null;
  isVisible: boolean;
  sortOrder: number;
};

export type ProfessionalSpaceRecord = ProfessionalSpaceInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type ProfessionalRow = {
  id: string;
  name: string;
  rolePt: string | null;
  roleEn: string | null;
  roleFr: string | null;
  bioPt: string | null;
  bioEn: string | null;
  bioFr: string | null;
  imageUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ProfessionalSpaceRow = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string | null;
  nameFr: string | null;
  descriptionPt: string | null;
  descriptionEn: string | null;
  descriptionFr: string | null;
  benefitsPt: string[];
  benefitsEn: string[];
  benefitsFr: string[];
  imageUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function normalizeNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeList(values?: string[]) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

export function slugifyProfessionalContent(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

const professionalSelect = `
  select
    id,
    name,
    role_pt as "rolePt",
    role_en as "roleEn",
    role_fr as "roleFr",
    bio_pt as "bioPt",
    bio_en as "bioEn",
    bio_fr as "bioFr",
    image_url as "imageUrl",
    is_visible as "isVisible",
    sort_order as "sortOrder",
    created_at::text as "createdAt",
    updated_at::text as "updatedAt"
  from professionals
`;

const spaceSelect = `
  select
    id,
    slug,
    name_pt as "namePt",
    name_en as "nameEn",
    name_fr as "nameFr",
    description_pt as "descriptionPt",
    description_en as "descriptionEn",
    description_fr as "descriptionFr",
    benefits_pt as "benefitsPt",
    benefits_en as "benefitsEn",
    benefits_fr as "benefitsFr",
    image_url as "imageUrl",
    is_visible as "isVisible",
    sort_order as "sortOrder",
    created_at::text as "createdAt",
    updated_at::text as "updatedAt"
  from professional_spaces
`;

export async function listPublicProfessionals() {
  return query<ProfessionalRow>(
    `
      ${professionalSelect}
      where is_visible = true
      order by sort_order, name
    `,
  );
}

export async function listAdminProfessionals() {
  return query<ProfessionalRow>(
    `
      ${professionalSelect}
      order by sort_order, name
    `,
  );
}

export async function createProfessional(input: ProfessionalInput) {
  const row = await queryOne<ProfessionalRow>(
    `
      insert into professionals (
        name,
        role_pt,
        role_en,
        role_fr,
        bio_pt,
        bio_en,
        bio_fr,
        image_url,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning
        id,
        name,
        role_pt as "rolePt",
        role_en as "roleEn",
        role_fr as "roleFr",
        bio_pt as "bioPt",
        bio_en as "bioEn",
        bio_fr as "bioFr",
        image_url as "imageUrl",
        is_visible as "isVisible",
        sort_order as "sortOrder",
        created_at::text as "createdAt",
        updated_at::text as "updatedAt"
    `,
    [
      input.name.trim(),
      normalizeNullable(input.rolePt),
      normalizeNullable(input.roleEn),
      normalizeNullable(input.roleFr),
      normalizeNullable(input.bioPt),
      normalizeNullable(input.bioEn),
      normalizeNullable(input.bioFr),
      normalizeNullable(input.imageUrl),
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) throw new Error("Professional was not created");
  return row;
}

export async function updateProfessional(id: string, input: ProfessionalInput) {
  return queryOne<ProfessionalRow>(
    `
      update professionals
      set
        name = $2,
        role_pt = $3,
        role_en = $4,
        role_fr = $5,
        bio_pt = $6,
        bio_en = $7,
        bio_fr = $8,
        image_url = $9,
        is_visible = $10,
        sort_order = $11
      where id = $1
      returning
        id,
        name,
        role_pt as "rolePt",
        role_en as "roleEn",
        role_fr as "roleFr",
        bio_pt as "bioPt",
        bio_en as "bioEn",
        bio_fr as "bioFr",
        image_url as "imageUrl",
        is_visible as "isVisible",
        sort_order as "sortOrder",
        created_at::text as "createdAt",
        updated_at::text as "updatedAt"
    `,
    [
      id,
      input.name.trim(),
      normalizeNullable(input.rolePt),
      normalizeNullable(input.roleEn),
      normalizeNullable(input.roleFr),
      normalizeNullable(input.bioPt),
      normalizeNullable(input.bioEn),
      normalizeNullable(input.bioFr),
      normalizeNullable(input.imageUrl),
      input.isVisible,
      input.sortOrder,
    ],
  );
}

export async function deleteProfessional(id: string) {
  await query("delete from professionals where id = $1", [id]);
}

export async function listPublicProfessionalSpaces() {
  return query<ProfessionalSpaceRow>(
    `
      ${spaceSelect}
      where is_visible = true
      order by sort_order, name_pt
    `,
  );
}

export async function listAdminProfessionalSpaces() {
  return query<ProfessionalSpaceRow>(
    `
      ${spaceSelect}
      order by sort_order, name_pt
    `,
  );
}

export async function createProfessionalSpace(input: ProfessionalSpaceInput) {
  const slug = input.slug?.trim() || slugifyProfessionalContent(input.namePt);

  const row = await queryOne<ProfessionalSpaceRow>(
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
        image_url,
        is_visible,
        sort_order
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12, $13)
      returning
        id,
        slug,
        name_pt as "namePt",
        name_en as "nameEn",
        name_fr as "nameFr",
        description_pt as "descriptionPt",
        description_en as "descriptionEn",
        description_fr as "descriptionFr",
        benefits_pt as "benefitsPt",
        benefits_en as "benefitsEn",
        benefits_fr as "benefitsFr",
        image_url as "imageUrl",
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
      JSON.stringify(normalizeList(input.benefitsPt)),
      JSON.stringify(normalizeList(input.benefitsEn)),
      JSON.stringify(normalizeList(input.benefitsFr)),
      normalizeNullable(input.imageUrl),
      input.isVisible,
      input.sortOrder,
    ],
  );

  if (!row) throw new Error("Professional space was not created");
  return row;
}

export async function updateProfessionalSpace(id: string, input: ProfessionalSpaceInput) {
  const slug = input.slug?.trim() || slugifyProfessionalContent(input.namePt);

  return queryOne<ProfessionalSpaceRow>(
    `
      update professional_spaces
      set
        slug = $2,
        name_pt = $3,
        name_en = $4,
        name_fr = $5,
        description_pt = $6,
        description_en = $7,
        description_fr = $8,
        benefits_pt = $9::jsonb,
        benefits_en = $10::jsonb,
        benefits_fr = $11::jsonb,
        image_url = $12,
        is_visible = $13,
        sort_order = $14
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
        benefits_pt as "benefitsPt",
        benefits_en as "benefitsEn",
        benefits_fr as "benefitsFr",
        image_url as "imageUrl",
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
      JSON.stringify(normalizeList(input.benefitsPt)),
      JSON.stringify(normalizeList(input.benefitsEn)),
      JSON.stringify(normalizeList(input.benefitsFr)),
      normalizeNullable(input.imageUrl),
      input.isVisible,
      input.sortOrder,
    ],
  );
}

export async function deleteProfessionalSpace(id: string) {
  await query("delete from professional_spaces where id = $1", [id]);
}
