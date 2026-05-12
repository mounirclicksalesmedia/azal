import type { Dictionary } from '../dictionaries';

export default function Marquee({ dict }: { dict: Dictionary }) {
  const words = dict.features.items.map((i) => i.title);
  const items = [...words, ...words];
  return (
    <section
      aria-hidden
      className="overflow-hidden border-y"
      style={{
        borderColor: 'var(--line)',
        background: 'var(--bronze-900)',
        color: 'var(--cream)',
        paddingBlock: '1.6rem',
      }}
    >
      <div className="marquee font-display text-2xl sm:text-3xl" style={{ fontWeight: 300 }}>
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>{w}</span>
            <span style={{ color: 'var(--gold)' }}>✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
