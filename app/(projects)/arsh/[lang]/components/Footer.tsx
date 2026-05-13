import type { Dictionary } from '../dictionaries';

type Props = { dict: Dictionary };

export default function Footer({ dict }: Props) {
  return (
    <footer className="arsh-footer">
      <div className="arsh-container arsh-foot-row">
        <div>{dict.footer.copy}</div>
        <div className="mono">{dict.footer.mono}</div>
      </div>
    </footer>
  );
}
