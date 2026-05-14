import type { Dictionary } from '../dictionaries';

type Props = { dict: Dictionary };

export default function Footer({ dict }: Props) {
  return (
    <footer className="asha-footer">
      <div className="asha-container asha-foot-row">
        <div>{dict.footer.copy}</div>
        <div className="mono">{dict.footer.mono}</div>
      </div>
    </footer>
  );
}
