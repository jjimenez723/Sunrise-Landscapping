import { socialLinks } from "../data/site";

const iconPaths = {
  facebook:
    "M13.5 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.8 1.8-1.8H17V2.4c-.8-.1-1.7-.2-2.5-.2-2.6 0-4.4 1.6-4.4 4.6v2.7H7V13h3.1v9Z",
  whatsapp:
    "M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.2 1.6 6L.2 24l6.3-1.7a11.8 11.8 0 0 0 5.6 1.4c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.4-8.4ZM12.1 21.7a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6Zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.2-.1-.4-.1-.6.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.4.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.6-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z",
};

export default function SocialLinks() {
  if (!socialLinks.length) return null;

  return (
    <nav className="social-links" aria-label="Social and messaging links">
      {socialLinks.map(({ id, label, url, action }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${action || `Visit ${label}`} (opens in a new tab)`}
        >
          {iconPaths[id] && (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={iconPaths[id]} />
            </svg>
          )}
          {label}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}
