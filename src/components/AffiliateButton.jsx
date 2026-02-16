export default function AffiliateButton({ href, children = "Check Price" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="affiliate-button"
    >
      {children}
    </a>
  );
}

