/**
 * Shared white card wrapper used by every chart/list section, so
 * spacing and border styling stay consistent without repeating classes.
 * @param {{ title: string, children: React.ReactNode }} props
 */
export function Panel({ title, children }) {
  return (
    <section className="min-w-0 rounded-md border border-border bg-surface p-4">
      <h2 className="m-0 mb-3 text-sm font-bold text-text">{title}</h2>
      <div className="min-h-0">{children}</div>
    </section>
  );
}
