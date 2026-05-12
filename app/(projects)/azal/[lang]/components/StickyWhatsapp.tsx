import type { Dictionary } from '../dictionaries';

const WHATSAPP = '966573778850';

export default function StickyWhatsapp({ dict }: { dict: Dictionary }) {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}`}
      target="_blank"
      rel="noreferrer"
      className="sticky-whatsapp"
      aria-label={dict.contact.whatsapp}
    >
      <span className="sticky-whatsapp-pulse" aria-hidden />
      <span className="sticky-whatsapp-pulse sticky-whatsapp-pulse--delay" aria-hidden />
      <svg
        className="sticky-whatsapp-svg"
        viewBox="0 0 32 32"
        aria-hidden
        focusable="false"
      >
        <path
          fill="#FFFFFF"
          d="M16 3C9.1 3 3.5 8.6 3.5 15.4c0 2.4.7 4.7 1.9 6.7L3 29l7.1-2.3c1.9 1 4 1.6 6 1.6h.1c6.9 0 12.5-5.6 12.5-12.4S22.9 3 16 3Zm0 22.7h-.1c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-4.2 1.4 1.4-4.1-.3-.4a10.3 10.3 0 0 1-1.6-5.6c0-5.7 4.6-10.4 10.4-10.4 2.8 0 5.4 1.1 7.3 3 1.9 2 3 4.6 3 7.4 0 5.7-4.6 10.3-10.3 10.3Zm5.7-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.1 3c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z"
        />
      </svg>
    </a>
  );
}
