import { useEffect, useRef, useState } from "react";

import { navItems } from "../constants";

export default function Mobile() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const onOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const onClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  // Focus first link when drawer opens
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap inside drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
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

  return (
    <>
      {/* Hamburger button — only on mobile */}
      <button
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        onClick={onOpen}
        className="sm:hidden flex items-center justify-center w-8 h-8 text-text-secondary hover:text-text-primary transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-surface border-l border-surface-border transform transition-transform duration-300 ease-in-out sm:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-nav-height px-6 border-b border-surface-border">
          <span className="text-text-primary font-semibold text-sm">Menú</span>
          <button
            aria-label="Cerrar menú de navegación"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col p-6 gap-1" aria-label="Mobile navigation">
          {navItems
            .filter((item) => item.show)
            .map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                ref={index === 0 ? firstLinkRef : undefined}
                onClick={onClose}
                className="flex items-center h-11 px-3 text-text-secondary hover:text-text-primary hover:bg-surface-raised rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
        </nav>
      </div>
    </>
  );
}
