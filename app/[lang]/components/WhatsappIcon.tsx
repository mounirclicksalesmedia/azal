export default function WhatsappIcon({
  className,
  phoneColor = 'var(--cream)',
}: {
  className?: string;
  phoneColor?: string;
}) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3.1a8.8 8.8 0 0 0-7.6 13.2l-1 4.1 4.2-1a8.8 8.8 0 1 0 4.4-16.3Z"
        fill="currentColor"
      />
      <path
        d="M9.2 7.4c.2-.4.4-.5.8-.5h.5c.2 0 .5.1.7.5l.8 1.8c.1.3.1.6-.1.8l-.5.6c-.1.2-.2.4-.1.6.5 1 1.5 2 2.6 2.5.2.1.4.1.6-.1l.7-.6c.2-.2.5-.2.8-.1l1.7.8c.3.1.5.4.5.7v.6c0 .4-.2.7-.5.9-.7.5-1.7.6-2.7.3-2.9-.9-6-3.9-6.9-6.8-.3-.9-.1-1.8.5-2.6Z"
        fill={phoneColor}
      />
    </svg>
  );
}
