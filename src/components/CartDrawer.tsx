import { useTranslation } from "react-i18next";
import { useCart } from "@/store/cart";
import { X, Minus, Plus, Trash2 } from "lucide-react";

export function CartDrawer() {
  const { t } = useTranslation();
  const { items, open, setOpen, setQty, remove, subtotal, clear } = useCart();

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
            <div className="font-display text-2xl mt-1">{items.length} {items.length === 1 ? "item" : "items"}</div>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 text-muted-foreground hover:text-primary"><X className="w-5 h-5" /></button>
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
                  <button onClick={() => setQty(i.id, i.qty - 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm w-6 text-center">{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} className="w-7 h-7 border border-border flex items-center justify-center hover:border-primary"><Plus className="w-3 h-3" /></button>
                  <button onClick={() => remove(i.id)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 inset-x-0 border-t border-border p-6 bg-background space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="eyebrow">{t("shop.subtotal")}</span>
            <span className="font-display text-2xl text-gradient-gold">{subtotal().toFixed(2)} €</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => { clear(); setOpen(false); alert("Demo checkout — visual only"); }}
            className="w-full h-12 bg-primary text-primary-foreground text-[12px] uppercase tracking-[0.25em] disabled:opacity-40 hover:bg-primary/90 transition"
          >
            {t("common.checkout")}
          </button>
        </div>
      </aside>
    </div>
  );
}
