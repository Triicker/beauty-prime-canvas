import "@tanstack/react-start/server-only";

import { isDatabaseConfigured, queryOne } from "./db.server";
import { getCurrentAdmin, type AdminUser } from "./session.server";

type AdminListItem = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
  updatedAt: string;
};

type CountRow = {
  services: string;
  products: string;
  professionals: string;
  spaces: string;
  gallery: string;
  marketing: string;
  appointments: string;
  submissions: string;
};

type DashboardRows = {
  services: AdminListItem[];
  products: AdminListItem[];
  professionals: AdminListItem[];
  spaces: AdminListItem[];
  gallery: AdminListItem[];
  marketing: AdminListItem[];
};

export type AdminDashboard = {
  authenticated: boolean;
  databaseConfigured: boolean;
  user: AdminUser | null;
  counts: Record<keyof CountRow, number>;
  rows: DashboardRows;
};

const emptyCounts: Record<keyof CountRow, number> = {
  services: 0,
  products: 0,
  professionals: 0,
  spaces: 0,
  gallery: 0,
  marketing: 0,
  appointments: 0,
  submissions: 0,
};

const emptyRows: DashboardRows = {
  services: [],
  products: [],
  professionals: [],
  spaces: [],
  gallery: [],
  marketing: [],
};

function normalizeCounts(row: CountRow | null) {
  if (!row) return emptyCounts;

  return {
    services: Number(row.services),
    products: Number(row.products),
    professionals: Number(row.professionals),
    spaces: Number(row.spaces),
    gallery: Number(row.gallery),
    appointments: Number(row.appointments),
    submissions: Number(row.submissions),
  };
}

async function listItems(table: string, titleColumn: string, subtitleColumn: string | null) {
  const subtitleSql = subtitleColumn ? `${subtitleColumn}::text` : "null";

  return queryOne<{ items: AdminListItem[] }>(
    `
      select coalesce(json_agg(item order by item."sortOrder", item.title), '[]'::json) as items
      from (
        select
          id,
          ${titleColumn}::text as title,
          ${subtitleSql} as "subtitle",
          image_url as "imageUrl",
          is_visible as "isVisible",
          sort_order as "sortOrder",
          updated_at::text as "updatedAt"
        from ${table}
        order by sort_order, ${titleColumn}
        limit 12
      ) item
    `,
  );
}

export async function getAdminDashboard(request: Request): Promise<AdminDashboard> {
  const databaseConfigured = isDatabaseConfigured();
  const user = await getCurrentAdmin(request);

  if (!databaseConfigured || !user) {
    return {
      authenticated: Boolean(user),
      databaseConfigured,
      user,
      counts: emptyCounts,
      rows: emptyRows,
    };
  }

  const counts = await queryOne<CountRow>(`
    select
      (select count(*) from services) as services,
      (select count(*) from products) as products,
      (select count(*) from professionals) as professionals,
      (select count(*) from professional_spaces) as spaces,
      (select count(*) from gallery_images) as gallery,
      (
        select case
          when to_regclass('public.marketing_slides') is null then 0
          else (select count(*) from marketing_slides)
        end
      ) as marketing,
      (
        select case
          when to_regclass('public.appointments') is null then 0
          else (select count(*) from appointments)
        end
      ) as appointments,
      (select count(*) from form_submissions) as submissions
  `);

  const [services, products, professionals, spaces, gallery, marketing] = await Promise.all([
    listItems("services", "name_pt", "price_label"),
    listItems("products", "name_pt", "category"),
    listItems("professionals", "name", "role_pt"),
    listItems("professional_spaces", "name_pt", null),
    listItems("gallery_images", "coalesce(title_pt, category, 'Imagem')", "category"),
    Number(counts?.marketing ?? 0) > 0
      ? listItems("marketing_slides", "title", "button_label")
      : Promise.resolve(null),
  ]);

  return {
    authenticated: true,
    databaseConfigured,
    user,
    counts: normalizeCounts(counts),
    rows: {
      services: services?.items ?? [],
      products: products?.items ?? [],
      professionals: professionals?.items ?? [],
      spaces: spaces?.items ?? [],
      gallery: gallery?.items ?? [],
      marketing: marketing?.items ?? [],
    },
  };
}
