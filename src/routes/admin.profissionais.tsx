import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";

import type { ProfessionalRecord, ProfessionalSpaceRecord } from "@/lib/admin/professionals.server";

type Tab = "professionals" | "spaces";

type ProfessionalForm = {
  id?: string;
  name: string;
  rolePt: string;
  roleEn: string;
  roleFr: string;
  bioPt: string;
  bioEn: string;
  bioFr: string;
  imageUrl: string;
  isVisible: boolean;
  sortOrder: string;
};

type SpaceForm = {
  id?: string;
  slug: string;
  namePt: string;
  nameEn: string;
  nameFr: string;
  descriptionPt: string;
  descriptionEn: string;
  descriptionFr: string;
  benefitsPt: string;
  benefitsEn: string;
  benefitsFr: string;
  imageUrl: string;
  isVisible: boolean;
  sortOrder: string;
};

const emptyProfessionalForm: ProfessionalForm = {
  name: "",
  rolePt: "",
  roleEn: "",
  roleFr: "",
  bioPt: "",
  bioEn: "",
  bioFr: "",
  imageUrl: "",
  isVisible: true,
  sortOrder: "0",
};

const emptySpaceForm: SpaceForm = {
  slug: "",
  namePt: "",
  nameEn: "",
  nameFr: "",
  descriptionPt: "",
  descriptionEn: "",
  descriptionFr: "",
  benefitsPt: "",
  benefitsEn: "",
  benefitsFr: "",
  imageUrl: "",
  isVisible: true,
  sortOrder: "0",
};

export const Route = createFileRoute("/admin/profissionais")({
  component: AdminProfessionalsPage,
});

function toProfessionalForm(professional: ProfessionalRecord): ProfessionalForm {
  return {
    id: professional.id,
    name: professional.name,
    rolePt: professional.rolePt ?? "",
    roleEn: professional.roleEn ?? "",
    roleFr: professional.roleFr ?? "",
    bioPt: professional.bioPt ?? "",
    bioEn: professional.bioEn ?? "",
    bioFr: professional.bioFr ?? "",
    imageUrl: professional.imageUrl ?? "",
    isVisible: professional.isVisible,
    sortOrder: String(professional.sortOrder),
  };
}

function toSpaceForm(space: ProfessionalSpaceRecord): SpaceForm {
  return {
    id: space.id,
    slug: space.slug,
    namePt: space.namePt,
    nameEn: space.nameEn ?? "",
    nameFr: space.nameFr ?? "",
    descriptionPt: space.descriptionPt ?? "",
    descriptionEn: space.descriptionEn ?? "",
    descriptionFr: space.descriptionFr ?? "",
    benefitsPt: space.benefitsPt.join("\n"),
    benefitsEn: space.benefitsEn.join("\n"),
    benefitsFr: space.benefitsFr.join("\n"),
    imageUrl: space.imageUrl ?? "",
    isVisible: space.isVisible,
    sortOrder: String(space.sortOrder),
  };
}

function lines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function AdminProfessionalsPage() {
  const [tab, setTab] = useState<Tab>("professionals");
  const [professionals, setProfessionals] = useState<ProfessionalRecord[]>([]);
  const [spaces, setSpaces] = useState<ProfessionalSpaceRecord[]>([]);
  const [professionalForm, setProfessionalForm] = useState<ProfessionalForm>(emptyProfessionalForm);
  const [spaceForm, setSpaceForm] = useState<SpaceForm>(emptySpaceForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedProfessional = useMemo(
    () => professionals.find((professional) => professional.id === professionalForm.id),
    [professionalForm.id, professionals],
  );
  const selectedSpace = useMemo(
    () => spaces.find((space) => space.id === spaceForm.id),
    [spaceForm.id, spaces],
  );

  async function loadProfessionals() {
    setIsLoading(true);
    setMessage("");

    try {
      const [professionalsResponse, spacesResponse] = await Promise.all([
        fetch("/api/admin/professionals"),
        fetch("/api/admin/professional-spaces"),
      ]);

      if (professionalsResponse.status === 401 || spacesResponse.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!professionalsResponse.ok || !spacesResponse.ok) {
        throw new Error("Falha ao carregar profissionais");
      }

      const professionalsData = (await professionalsResponse.json()) as {
        professionals: ProfessionalRecord[];
      };
      const spacesData = (await spacesResponse.json()) as { spaces: ProfessionalSpaceRecord[] };

      setProfessionals(professionalsData.professionals);
      setSpaces(spacesData.spaces);

      if (!professionalForm.id && professionalsData.professionals[0]) {
        setProfessionalForm(toProfessionalForm(professionalsData.professionals[0]));
      }
      if (!spaceForm.id && spacesData.spaces[0]) {
        setSpaceForm(toSpaceForm(spacesData.spaces[0]));
      }
    } catch {
      setMessage("Não foi possível carregar profissionais e espaços.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProfessionals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateProfessional<K extends keyof ProfessionalForm>(
    key: K,
    value: ProfessionalForm[K],
  ) {
    setProfessionalForm((current) => ({ ...current, [key]: value }));
  }

  function updateSpace<K extends keyof SpaceForm>(key: K, value: SpaceForm[K]) {
    setSpaceForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProfessional(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const url = professionalForm.id
        ? `/api/admin/professionals/${professionalForm.id}`
        : "/api/admin/professionals";
      const response = await fetch(url, {
        method: professionalForm.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: professionalForm.name,
          rolePt: professionalForm.rolePt || null,
          roleEn: professionalForm.roleEn || null,
          roleFr: professionalForm.roleFr || null,
          bioPt: professionalForm.bioPt || null,
          bioEn: professionalForm.bioEn || null,
          bioFr: professionalForm.bioFr || null,
          imageUrl: professionalForm.imageUrl || null,
          isVisible: professionalForm.isVisible,
          sortOrder: Number(professionalForm.sortOrder || 0),
        }),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      const data = (await response.json()) as { professional: ProfessionalRecord };
      setProfessionalForm(toProfessionalForm(data.professional));
      setMessage("Profissional salvo.");
      await loadProfessionals();
    } catch {
      setMessage("Não foi possível salvar o profissional.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveSpace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const url = spaceForm.id
        ? `/api/admin/professional-spaces/${spaceForm.id}`
        : "/api/admin/professional-spaces";
      const response = await fetch(url, {
        method: spaceForm.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: spaceForm.slug,
          namePt: spaceForm.namePt,
          nameEn: spaceForm.nameEn || null,
          nameFr: spaceForm.nameFr || null,
          descriptionPt: spaceForm.descriptionPt || null,
          descriptionEn: spaceForm.descriptionEn || null,
          descriptionFr: spaceForm.descriptionFr || null,
          benefitsPt: lines(spaceForm.benefitsPt),
          benefitsEn: lines(spaceForm.benefitsEn),
          benefitsFr: lines(spaceForm.benefitsFr),
          imageUrl: spaceForm.imageUrl || null,
          isVisible: spaceForm.isVisible,
          sortOrder: Number(spaceForm.sortOrder || 0),
        }),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      const data = (await response.json()) as { space: ProfessionalSpaceRecord };
      setSpaceForm(toSpaceForm(data.space));
      setMessage("Espaço salvo.");
      await loadProfessionals();
    } catch {
      setMessage("Não foi possível salvar o espaço.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProfessionalItem() {
    if (!professionalForm.id || !confirm("Excluir este profissional?")) return;

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/professionals/${professionalForm.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falha ao excluir");

      setProfessionalForm(emptyProfessionalForm);
      setMessage("Profissional excluído.");
      await loadProfessionals();
    } catch {
      setMessage("Não foi possível excluir o profissional.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteSpaceItem() {
    if (!spaceForm.id || !confirm("Excluir este espaço?")) return;

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/professional-spaces/${spaceForm.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Falha ao excluir");

      setSpaceForm(emptySpaceForm);
      setMessage("Espaço excluído.");
      await loadProfessionals();
    } catch {
      setMessage("Não foi possível excluir o espaço.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="bg-background py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-3">Admin LOMA</div>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">Profissionais</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Gerencie profissionais do agendamento e espaços/cadeiras da página de profissionais.
            </p>
          </div>
          <Link
            to="/admin"
            className="inline-flex h-10 items-center border border-border px-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            Painel
          </Link>
        </header>

        <div className="mt-8 flex flex-wrap gap-2">
          <TabButton active={tab === "professionals"} onClick={() => setTab("professionals")}>
            Profissionais
          </TabButton>
          <TabButton active={tab === "spaces"} onClick={() => setTab("spaces")}>
            Espaços e cadeiras
          </TabButton>
        </div>

        {message && <p className="mt-5 text-sm text-primary">{message}</p>}

        {tab === "professionals" ? (
          <div className="grid gap-6 pt-8 lg:grid-cols-[minmax(260px,380px)_1fr]">
            <ListPanel
              title="Profissionais"
              count={professionals.length}
              isLoading={isLoading}
              empty="Nenhum profissional cadastrado."
            >
              {professionals.map((professional) => (
                <button
                  key={professional.id}
                  type="button"
                  onClick={() => setProfessionalForm(toProfessionalForm(professional))}
                  className={`block w-full p-4 text-left transition ${
                    professional.id === professionalForm.id
                      ? "bg-primary/10"
                      : "hover:bg-secondary/60"
                  }`}
                >
                  <div className="truncate text-sm font-medium">{professional.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {professional.rolePt ?? "Sem função"}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {professional.isVisible ? "Visível" : "Oculto"} · ordem {professional.sortOrder}
                  </div>
                </button>
              ))}
            </ListPanel>

            <form onSubmit={saveProfessional} className="border border-border bg-card p-5 md:p-7">
              <EditorHeader onNew={() => setProfessionalForm(emptyProfessionalForm)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nome"
                  value={professionalForm.name}
                  onChange={(value) => updateProfessional("name", value)}
                  required
                />
                <Field
                  label="Ordem"
                  type="number"
                  value={professionalForm.sortOrder}
                  onChange={(value) => updateProfessional("sortOrder", value)}
                />
                <Field
                  label="Função PT"
                  value={professionalForm.rolePt}
                  onChange={(value) => updateProfessional("rolePt", value)}
                />
                <Field
                  label="Função EN"
                  value={professionalForm.roleEn}
                  onChange={(value) => updateProfessional("roleEn", value)}
                />
                <Field
                  label="Função FR"
                  value={professionalForm.roleFr}
                  onChange={(value) => updateProfessional("roleFr", value)}
                />
                <Field
                  label="URL da imagem"
                  value={professionalForm.imageUrl}
                  onChange={(value) => updateProfessional("imageUrl", value)}
                />
                <TextArea
                  label="Bio PT"
                  value={professionalForm.bioPt}
                  onChange={(value) => updateProfessional("bioPt", value)}
                />
                <TextArea
                  label="Bio EN"
                  value={professionalForm.bioEn}
                  onChange={(value) => updateProfessional("bioEn", value)}
                />
                <TextArea
                  label="Bio FR"
                  value={professionalForm.bioFr}
                  onChange={(value) => updateProfessional("bioFr", value)}
                />
                <Checkbox
                  label="Visível no site"
                  checked={professionalForm.isVisible}
                  onChange={(checked) => updateProfessional("isVisible", checked)}
                />
              </div>
              <Actions
                isSaving={isSaving}
                canSave={Boolean(professionalForm.name)}
                isEditing={Boolean(selectedProfessional)}
                onDelete={deleteProfessionalItem}
              />
            </form>
          </div>
        ) : (
          <div className="grid gap-6 pt-8 lg:grid-cols-[minmax(260px,380px)_1fr]">
            <ListPanel
              title="Espaços"
              count={spaces.length}
              isLoading={isLoading}
              empty="Nenhum espaço cadastrado."
            >
              {spaces.map((space) => (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => setSpaceForm(toSpaceForm(space))}
                  className={`flex w-full gap-4 p-4 text-left transition ${
                    space.id === spaceForm.id ? "bg-primary/10" : "hover:bg-secondary/60"
                  }`}
                >
                  <Preview imageUrl={space.imageUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{space.namePt}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{space.slug}</div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      {space.isVisible ? "Visível" : "Oculto"} · ordem {space.sortOrder}
                    </div>
                  </div>
                </button>
              ))}
            </ListPanel>

            <form onSubmit={saveSpace} className="border border-border bg-card p-5 md:p-7">
              <EditorHeader onNew={() => setSpaceForm(emptySpaceForm)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nome PT"
                  value={spaceForm.namePt}
                  onChange={(value) => updateSpace("namePt", value)}
                  required
                />
                <Field
                  label="Slug"
                  value={spaceForm.slug}
                  onChange={(value) => updateSpace("slug", value)}
                />
                <Field
                  label="Nome EN"
                  value={spaceForm.nameEn}
                  onChange={(value) => updateSpace("nameEn", value)}
                />
                <Field
                  label="Nome FR"
                  value={spaceForm.nameFr}
                  onChange={(value) => updateSpace("nameFr", value)}
                />
                <Field
                  label="URL da imagem"
                  value={spaceForm.imageUrl}
                  onChange={(value) => updateSpace("imageUrl", value)}
                />
                <Field
                  label="Ordem"
                  type="number"
                  value={spaceForm.sortOrder}
                  onChange={(value) => updateSpace("sortOrder", value)}
                />
                <TextArea
                  label="Descrição PT"
                  value={spaceForm.descriptionPt}
                  onChange={(value) => updateSpace("descriptionPt", value)}
                />
                <TextArea
                  label="Descrição EN"
                  value={spaceForm.descriptionEn}
                  onChange={(value) => updateSpace("descriptionEn", value)}
                />
                <TextArea
                  label="Descrição FR"
                  value={spaceForm.descriptionFr}
                  onChange={(value) => updateSpace("descriptionFr", value)}
                />
                <TextArea
                  label="Benefícios PT, um por linha"
                  value={spaceForm.benefitsPt}
                  onChange={(value) => updateSpace("benefitsPt", value)}
                />
                <TextArea
                  label="Benefícios EN, um por linha"
                  value={spaceForm.benefitsEn}
                  onChange={(value) => updateSpace("benefitsEn", value)}
                />
                <TextArea
                  label="Benefícios FR, um por linha"
                  value={spaceForm.benefitsFr}
                  onChange={(value) => updateSpace("benefitsFr", value)}
                />
                <Checkbox
                  label="Visível no site"
                  checked={spaceForm.isVisible}
                  onChange={(checked) => updateSpace("isVisible", checked)}
                />
              </div>
              <Actions
                isSaving={isSaving}
                canSave={Boolean(spaceForm.namePt)}
                isEditing={Boolean(selectedSpace)}
                onDelete={deleteSpaceItem}
              />
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 border px-4 text-[11px] uppercase tracking-[0.2em] transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function ListPanel({
  title,
  count,
  isLoading,
  empty,
  children,
}: {
  title: string;
  count: number;
  isLoading: boolean;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-2xl">{title}</h2>
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {count}
        </span>
      </div>
      <div className="max-h-[760px] divide-y divide-border overflow-y-auto">
        {isLoading && <p className="p-5 text-sm text-muted-foreground">Carregando...</p>}
        {!isLoading && count === 0 && <p className="p-5 text-sm text-muted-foreground">{empty}</p>}
        {children}
      </div>
    </aside>
  );
}

function EditorHeader({ onNew }: { onNew: () => void }) {
  return (
    <div className="mb-6 flex justify-end">
      <button
        type="button"
        onClick={onNew}
        className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-[11px] uppercase tracking-[0.2em] text-primary-foreground"
      >
        <Plus className="h-4 w-4" />
        Novo
      </button>
    </div>
  );
}

function Preview({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-secondary">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
}

function Actions({
  isSaving,
  canSave,
  isEditing,
  onDelete,
}: {
  isSaving: boolean;
  canSave: boolean;
  isEditing: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <button
        type="submit"
        disabled={isSaving || !canSave}
        className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-[11px] uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {isEditing ? "Salvar" : "Criar"}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isSaving}
          className="inline-flex h-11 items-center gap-2 border border-destructive/40 px-5 text-[11px] uppercase tracking-[0.2em] text-destructive disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="eyebrow">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      {label}
    </label>
  );
}
