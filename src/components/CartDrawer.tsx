import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { FormEvent } from "react";
import { useCart } from "@/store/cart";
import { X, Minus, Plus, Trash2 } from "lucide-react";

export function CartDrawer() {
  const { t } = useTranslation();
  const { items, open, setOpen, setQty, remove, subtotal, clear } = useCart();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submitCartRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0 || sending) return;

    setSending(true);
    setSent(false);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/cart-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        notes: formData.get("notes"),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
      }),
    }).catch(() => null);

    setSending(false);

    if (!response?.ok) {
      const data = await response?.json().catch(() => null);
      setError(
        data?.message && typeof data.message === "string"
          ? data.message
          : "Não foi possível enviar a lista. Tente novamente.",
      );
      return;
    }

    form.reset();
    clear();
    setSent(true);
  }

  return (
    <div className={`fixed inset-0 z-[60] pointer-events-none ${open ? "" : ""}`}>
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-background border-l border-border shadow-2xl transition-transform duration-500 ${open ? "translate-x-0 pointer-events-auto" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-border">
          <div>
            <div className="eyebrow">{t("shop.cart")}</div>
            <div className="font-display text-2xl mt-1">
              {items.length} {t(items.length === 1 ? "shop.item" : "shop.items")}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-muted-foreground hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-20rem)] px-6 py-6 space-y-5">
          {items.length === 0 && <p className="text-muted-foreground text-sm">{t("shop.empty")}</p>}
          {items.map((i) => (
            <div key={i.id} className="flex gap-4">
              <img src={i.image} alt={i.name} className="w-20 h-24 object-cover" />
              <div className="flex-1">
                <div className="text-sm font-medium">{i.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{i.price.toFixed(2)} €</div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setQty(i.id, i.qty - 1)}
                    className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm w-6 text-center">{i.qty}</span>
                  <button
                    onClick={() => setQty(i.id, i.qty + 1)}
                    className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => remove(i.id)}
                    className="ml-auto text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={submitCartRequest}
          className="absolute bottom-0 inset-x-0 border-t border-border p-6 bg-background space-y-4"
        >
          <div className="flex justify-between items-baseline">
            <span className="eyebrow">{t("shop.subtotal")}</span>
            <span className="font-display text-2xl text-gradient-gold">
              {subtotal().toFixed(2)} €
            </span>
          </div>
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <input
                name="name"
                required
                placeholder="Nome"
                className="col-span-2 bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Telefone"
                className="bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                name="notes"
                rows={2}
                placeholder="Notas"
                className="col-span-2 bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={items.length === 0}
            className="w-full h-12 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.25em] disabled:opacity-40 hover:bg-primary/90 transition"
          >
            {sending ? "A enviar..." : t("common.checkout")}
          </button>
          {sent && <p className="text-sm text-primary text-center">Lista enviada com sucesso.</p>}
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </form>
      </aside>
    </div>
  );
}
