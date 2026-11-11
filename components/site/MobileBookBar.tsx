import { formatMXN } from "@/lib/utils";

export default function MobileBookBar({
  priceMXN,
  priceType,
}: {
  priceMXN: number;
  priceType: "PER_PERSON" | "FLAT_PER_BOAT";
}) {
  return (
    <div className="border-border-soft bg-surface-deep/95 fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.3)] backdrop-blur lg:hidden">
      <div>
        <p className="text-lg font-extrabold text-white">{formatMXN(priceMXN)}</p>
        <p className="text-xs text-white/50">
          {priceType === "PER_PERSON" ? "per person" : "per boat"}
        </p>
      </div>
      <a
        href="#book"
        className="rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-red/90"
      >
        Reserve Now
      </a>
    </div>
  );
}
