import "@tanstack/react-start/server-only";

import { isDatabaseConfigured, query, queryOne } from "./db.server";
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

type DashboardAppointmentItem = {
  id: string;
  service: string | null;
  professional: string | null;
  customerName: string | null;
  customerPhone: string | null;
  startsAt: string | null;
  status: string;
};

type DashboardSubmissionItem = {
  id: string;
  type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  status: string | null;
};

type DashboardProductRequestItem = {
  name: string;
  quantity: number;
  requests: number;
};

type DashboardOperations = {
  todayAppointments: number;
  upcomingAppointments: DashboardAppointmentItem[];
  pendingAppointments: number;
  newMessages: number;
  newsletterSubscribers: number;
  mostRequestedProducts: DashboardProductRequestItem[];
  recentSubmissions: DashboardSubmissionItem[];
};

export type AdminDashboard = {
  authenticated: boolean;
  databaseConfigured: boolean;
  user: AdminUser | null;
  counts: Record<keyof CountRow, number>;
  rows: DashboardRows;
  operations: DashboardOperations;
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

const emptyOperations: DashboardOperations = {
  todayAppointments: 0,
  upcomingAppointments: [],
  pendingAppointments: 0,
  newMessages: 0,
  newsletterSubscribers: 0,
  mostRequestedProducts: [],
  recentSubmissions: [],
};

function normalizeCounts(row: CountRow | null) {
  if (!row) return emptyCounts;

  return {
    services: Number(row.services),
    products: Number(row.products),
    professionals: Number(row.professionals),
    spaces: Number(row.spaces),
    gallery: Number(row.gallery),
    marketing: Number(row.marketing),
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

async function getOperationalDashboard(): Promise<DashboardOperations> {
  const tableFlags = await queryOne<{
    appointments_exists: boolean;
    form_submissions_exists: boolean;
  }>(`
    select
      to_regclass('public.appointments') is not null as appointments_exists,
      to_regclass('public.form_submissions') is not null as form_submissions_exists
  `);

  const hasAppointments = Boolean(tableFlags?.appointments_exists);
  const hasSubmissions = Boolean(tableFlags?.form_submissions_exists);

  const [appointmentCounts, upcomingAppointments] = hasAppointments
    ? await Promise.all([
        queryOne<{ today: string; pending: string }>(`
          select
            count(*) filter (
              where (starts_at at time zone 'Europe/Lisbon')::date =
                (now() at time zone 'Europe/Lisbon')::date
            ) as today,
            count(*) filter (where status in ('pending', 'reschedule')) as pending
          from appointments
        `),
        query<DashboardAppointmentItem>(`
          select
            id,
            service,
            professional,
            customer_name as "customerName",
            customer_phone as "customerPhone",
            starts_at::text as "startsAt",
            status
          from appointments
          where starts_at >= now()
            and status in ('pending', 'confirmed', 'reschedule')
          order by starts_at asc
          limit 5
        `),
      ])
    : [null, [] as DashboardAppointmentItem[]];

  const [submissionCounts, recentSubmissions, mostRequestedProducts] = hasSubmissions
    ? await Promise.all([
        queryOne<{ new_messages: string; newsletter_subscribers: string }>(`
          select
            count(*) filter (
              where type in ('contact', 'cart_request', 'professional_inquiry')
                and created_at >= now() - interval '14 days'
            ) as new_messages,
            count(distinct lower(email)) filter (
              where type = 'newsletter' and email is not null
            ) as newsletter_subscribers
          from form_submissions
        `),
        query<DashboardSubmissionItem>(`
          select
            id,
            type,
            name,
            email,
            phone,
            created_at::text as "createdAt",
            status
          from form_submissions
          where type in ('contact', 'cart_request', 'professional_inquiry', 'newsletter')
          order by created_at desc
          limit 5
        `),
        query<DashboardProductRequestItem>(`
          select
            coalesce(item->>'name', item->>'title', 'Produto sem nome') as name,
            sum(coalesce(nullif(item->>'qty', '')::int, nullif(item->>'quantity', '')::int, 1))::int as quantity,
            count(*)::int as requests
          from form_submissions
          cross join lateral jsonb_array_elements(
            case
              when jsonb_typeof(payload->'items') = 'array' then payload->'items'
              else '[]'::jsonb
            end
          ) item
          where type = 'cart_request'
          group by coalesce(item->>'name', item->>'title', 'Produto sem nome')
          order by quantity desc, requests desc, name asc
          limit 5
        `),
      ])
    : [null, [] as DashboardSubmissionItem[], [] as DashboardProductRequestItem[]];

  return {
    todayAppointments: Number(appointmentCounts?.today ?? 0),
    upcomingAppointments,
    pendingAppointments: Number(appointmentCounts?.pending ?? 0),
    newMessages: Number(submissionCounts?.new_messages ?? 0),
    newsletterSubscribers: Number(submissionCounts?.newsletter_subscribers ?? 0),
    mostRequestedProducts,
    recentSubmissions,
  };
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
      operations: emptyOperations,
    };
  }

  const optionalTables = await queryOne<{
    appointments_exists: boolean;
    marketing_exists: boolean;
  }>(`
    select
      to_regclass('public.appointments') is not null as appointments_exists,
      to_regclass('public.marketing_slides') is not null as marketing_exists
  `);

  const counts = await queryOne<CountRow>(`
    select
      (select count(*) from services) as services,
      (select count(*) from products) as products,
      (select count(*) from professionals) as professionals,
      (select count(*) from professional_spaces) as spaces,
      (select count(*) from gallery_images) as gallery,
      ${optionalTables?.marketing_exists ? "(select count(*) from marketing_slides)" : "0"} as marketing,
      ${optionalTables?.appointments_exists ? "(select count(*) from appointments)" : "0"} as appointments,
      (select count(*) from form_submissions) as submissions
  `);

  const [services, products, professionals, spaces, gallery, marketing, operations] =
    await Promise.all([
      listItems("services", "name_pt", "price_label"),
      listItems("products", "name_pt", "category"),
      listItems("professionals", "name", "role_pt"),
      listItems("professional_spaces", "name_pt", null),
      listItems("gallery_images", "coalesce(title_pt, category, 'Imagem')", "category"),
      optionalTables?.marketing_exists && Number(counts?.marketing ?? 0) > 0
        ? listItems("marketing_slides", "title", "button_label")
        : Promise.resolve(null),
      getOperationalDashboard(),
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
    operations,
  };
}
