import { Check } from "lucide-react";

/**
 * @param {{
 *   isSubmitting: boolean,
 *   onReset: () => void,
 *   onCancel?: () => void,
 * }} props
 */
export function ProductFormActions({ isSubmitting, onReset, onCancel }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
      >
        <Check size={16} strokeWidth={2} />
        {isSubmitting ? "Saving…" : "Save Product"}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-text hover:bg-bg focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        Reset
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="px-2 text-sm font-semibold text-primary hover:underline focus:outline-none"
      >
        Cancel
      </button>
    </div>
  );
}
