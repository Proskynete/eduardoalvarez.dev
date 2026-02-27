import { useEffect, useRef, useState } from "react";

import { navItems } from "../constants";

interface MobileProps {
  version?: string;
}

export default function Mobile({ version }: MobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pathname, setPathname] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const onOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const onClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const visibleItems = navItems.filter((item) => item.show);

  return (
    <>
      {/* Hamburger button */}
      <button
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        onClick={onOpen}
        className="sm:hidden flex items-center justify-center w-8 h-8 text-text-secondary hover:text-text-primary transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Full-screen overlay */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed inset-0 z-50 bg-background flex flex-col sm:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-nav-height px-5 border-b border-surface-border flex-shrink-0">
          <a href="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <img src="/images/logo-mark.svg" alt="Logo mark" className="h-6 w-6" width="24" height="24" />
            <span className="text-text-primary font-bold text-sm tracking-tight group-hover:text-accent transition-colors duration-200">
              Eduardo Álvarez
            </span>
          </a>
          <button
            aria-label="Cerrar menú de navegación"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* CLI content */}
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-6 font-mono">
          {/* Claude CLI prompt — easter egg */}
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span className="text-accent">✻</span>
            <span className="text-text-muted">~/eduardoalvarez.dev</span>
          </div>

          {/* Question prompt */}
          <div className="flex items-start gap-2 text-sm mb-6">
            <span className="text-accent mt-0.5">?</span>
            <span className="text-text-secondary">¿A dónde quieres navegar?</span>
          </div>

          {/* CLI flags — easter egg */}
          <div className="mb-6 flex flex-col gap-1.5 text-xs border-l-2 border-surface-border pl-4">
            <div className="flex items-center gap-3">
              <span className="text-accent w-24 flex-shrink-0">--help</span>
              <span className="text-text-muted">Ver las secciones del sitio</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent w-24 flex-shrink-0">--version</span>
              <span className="text-text-muted">v{version ?? "—"}</span>
            </div>
          </div>

          {/* Nav options */}
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {visibleItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-start gap-3 px-3 py-3 rounded-md transition-colors duration-150 ${
                    isActive
                      ? "text-accent pointer-events-none"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
                  }`}
                >
                  {/* Diamond icon */}
                  <span
                    className={`mt-0.5 text-xs flex-shrink-0 ${isActive ? "text-accent" : "text-text-muted group-hover:text-accent"}`}
                  >
                    {isActive ? "◆" : "◇"}
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm">
                      <span className={`${isActive ? "text-accent" : "text-text-muted"}`}>./</span>
                      {item.name.toLowerCase()}
                    </span>
                    {item.description && <span className="text-xs text-text-muted font-mono">{item.description}</span>}
                  </div>
                </a>
              );
            })}
          </nav>

          {/* Blinking cursor */}
          <div className="mt-8 flex items-center gap-1.5 text-sm text-accent">
            <span>❯</span>
            <span className="animate-pulse leading-none">▌</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-border flex-shrink-0">
          <span className="font-mono text-xs text-text-muted select-none">cd ~/eduardoalvarez.dev</span>
        </div>
      </div>
    </>
  );
}
