const LINKS = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/in/" },
  { label: "Email", href: "mailto:hello@raouf.dev" },
];

const NAV_LINKS = [
  { label: "Stack", href: "#stack" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-black/10 dark:border-white/10 px-6 py-12"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
          {/* Logo + tagline */}
          <div>
            <p className="text-2xl font-bold text-black dark:text-white tracking-tight mb-1">
              Raouf.
            </p>
            <p className="text-sm text-black/40 dark:text-white/40">
              Building for the web — one project at a time.
            </p>
          </div>

          {/* Nav links */}
          <ul className="flex gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Contact links */}
          <ul className="flex gap-4">
            {LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className="text-sm font-medium px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom row */}
        <div className="border-t border-black/10 dark:border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-black/50 dark:text-white/30">
            © {new Date().getFullYear()} Raouf. All rights reserved.
          </p>
          <p className="text-xs text-black/50 dark:text-white/30">
            Built with Next.js & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
