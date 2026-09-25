import { Minus, Plus } from "lucide-react";

export function QuantityControl({ quantity, max, onChange }: { quantity: number; max: number; onChange: (quantity: number) => void }) {
  return (
    <div className="flex h-10 items-center rounded-lg border border-border bg-surface">
      <button type="button" onClick={() => onChange(quantity - 1)} disabled={quantity <= 1} aria-label="کاهش تعداد" className="flex size-9 items-center justify-center text-muted transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><Minus className="size-3.5" aria-hidden="true" /></button>
      <output className="w-7 text-center text-sm font-semibold text-foreground" aria-live="polite">{new Intl.NumberFormat("fa-IR").format(quantity)}</output>
      <button type="button" onClick={() => onChange(quantity + 1)} disabled={quantity >= max} aria-label="افزایش تعداد" className="flex size-9 items-center justify-center text-muted transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><Plus className="size-3.5" aria-hidden="true" /></button>
    </div>
  );
}
