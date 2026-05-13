import type { Dictionary } from '../dictionaries';
import Pill from './Pill';

type Props = { dict: Dictionary };

export default function Nav({ dict }: Props) {
  return (
    <header className="arsh-nav">
      <div className="arsh-container arsh-nav-inner">
        <a href="#top" className="arsh-brand">
          <div className="arsh-brand-mark">{dict.brand.mark}</div>
          <div className="arsh-brand-name">
            {dict.brand.name}
            <span className="en">{dict.brand.subname}</span>
          </div>
        </a>

        <nav className="arsh-nav-links" aria-label="Primary">
          {dict.nav.items.map((it) => (
            <a key={it.href} href={it.href}>
              <span className="num">{it.num}</span>
              {it.label}
            </a>
          ))}
        </nav>

        <Pill href="#booking" variant="solid">
          {dict.nav.cta}
        </Pill>
      </div>
    </header>
  );
}
