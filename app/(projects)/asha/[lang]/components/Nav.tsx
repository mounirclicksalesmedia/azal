import type { Dictionary } from '../dictionaries';
import Pill from './Pill';

type Props = { dict: Dictionary };

export default function Nav({ dict }: Props) {
  return (
    <header className="asha-nav">
      <div className="asha-container asha-nav-inner">
        <a href="#top" className="asha-brand">
          <div className="asha-brand-mark">{dict.brand.mark}</div>
          <div className="asha-brand-name">
            {dict.brand.name}
            <span className="en">{dict.brand.subname}</span>
          </div>
        </a>

        <nav className="asha-nav-links" aria-label="Primary">
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
