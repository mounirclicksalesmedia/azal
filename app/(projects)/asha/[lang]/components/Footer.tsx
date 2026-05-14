import Image from 'next/image';
import type { Dictionary } from '../dictionaries';

type Props = { dict: Dictionary };

export default function Footer({ dict }: Props) {
  return (
    <footer className="asha-footer">
      <div className="asha-container asha-foot-row">
        <a href="#top" className="asha-foot-brand" aria-label="Rawajeh Holding">
          <Image
            src="/brand/logo/black_logo.svg"
            alt="Rawajeh Holding"
            width={209}
            height={158}
            className="asha-foot-logo"
          />
        </a>
        <div>{dict.footer.copy}</div>
        <div className="mono">{dict.footer.mono}</div>
      </div>
    </footer>
  );
}
