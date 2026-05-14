import type { ReactNode } from 'react';
import { ArrowOut } from './Icons';

type Variant = 'default' | 'solid' | 'on-dark';

type Props = {
  href?: string;
  type?: 'button' | 'submit';
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  knob?: ReactNode;
};

export default function Pill({
  href,
  type = 'button',
  variant = 'default',
  className = '',
  style,
  children,
  knob,
}: Props) {
  const classes = [
    'asha-pill',
    variant === 'solid' ? 'solid' : '',
    variant === 'on-dark' ? 'on-dark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span>{children}</span>
      <span className="knob">{knob ?? <ArrowOut className="w-3.5 h-3.5" />}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} style={style}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={classes} style={style}>
      {inner}
    </button>
  );
}
