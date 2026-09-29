import { Nav, ThemeToggle } from "@eduardoalvarez/arrecife";
import { Logo } from "@eduardoalvarez/arrecife/brand";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "../../../../utils/analytics";
import MobileNav from "./components/mobile";
import NavLinks from "./components/nav-links";
import SearchInput from "./components/search-input";
import SearchResults from "./components/search-results";
import SearchToggleButton from "./components/search-toggle-button";
import type { AlgoliaConfig } from "./components/types";
import { useAlgoliaSearch } from "./components/use-algolia-search";
import { useKeyboardNavigation } from "./components/use-keyboard-navigation";
import { getArticleUrl, renderHighlightedText } from "./components/utils";

interface SiteNavProps {
  pathname?: string;
  version?: string;
  algolia?: AlgoliaConfig;
}

/**
 * The site bar, composed in React rather than in the `.astro` file.
 *
 * `Nav` takes `brand` and `actions` as `ReactNode`, and in Astro a `.astro`
 * component cannot be handed to a React one — markup written there arrives as a
 * template result and React rejects it. Only `children` crosses. Composing here
 * is the same move the footer already made.
 *
 * What the library replaced: the 64px sticky header with `bg-background/[.86]`
 * and `backdrop-blur-[14px]` written by hand (`Nav`), the fin + divider +
 * wordmark + tagline block (`Logo withTagline`), the nav items with their
 * brackets (`NavItem`), the theme switch with its two inline SVGs
 * (`ThemeToggle`) and the full-screen drawer with its hand-written focus trap
 * (`Sheet`, inside `MobileNav`).
 *
 * The scroll listener that added `backdrop-blur-sm` on top of the bar's own blur
 * went with them: it fought the 14px the design document specifies and did
 * nothing else.
 */
export default function SiteNav({ pathname: initialPathname = "", version, algolia }: SiteNavProps) {
  const [pathname, setPathname] = useState(initialPathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { searchResults, search, isSearching, error, hasSearched } = useAlgoliaSearch(algolia);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedIndex(-1);

    if (query.trim()) {
      await search(query);
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  const handleToggleSearch = () => {
    setIsInputVisible((prev) => !prev);
    if (isInputVisible) {
      setSearchQuery("");
      setIsSearchOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setIsSearchOpen(true);
    }
  };

  useKeyboardNavigation({
    isSearchOpen,
    searchResults,
    selectedIndex,
    onArrowDown: () => setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev)),
    onArrowUp: () => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1)),
    onEnter: () => {
      if (selectedIndex < 0) return;
      const url = getArticleUrl(searchResults[selectedIndex]);
      if (url && url !== "#") {
        window.location.href = url;
        handleResultClick();
      }
    },
    onEscape: () => {
      setIsSearchOpen(false);
      setSearchQuery("");
      setSelectedIndex(-1);
    },
  });

  /**
   * Four instances and not one, for two independent reasons that happen to
   * multiply.
   *
   * `background` resolves at render time and this site switches theme at
   * runtime, so both fins are rendered and CSS picks — the same rule `BrandFin`
   * already follows. And the tagline does not fit under 1060px: at exactly 1024
   * the bar used to run 2px over the viewport, which is horizontal scroll on
   * every page.
   *
   * The wide pair goes first in the DOM on purpose: it is the one on screen at
   * the widths the suite measures the fin at.
   */
  const brand = (
    <a href="/" aria-label="Eduardo Álvarez — Ir al inicio" className="focus-ring rounded-chip flex items-center">
      <span className="hidden min-[1060px]:block">
        <Logo withTagline background="dark" className="light:hidden" />
        <Logo withTagline background="light" className="hidden light:inline-flex" />
      </span>
      <span className="min-[1060px]:hidden">
        <Logo background="dark" className="light:hidden" />
        <Logo background="light" className="hidden light:inline-flex" />
      </span>
    </a>
  );

  const actions = (
    <>
      <div className="relative flex items-center" role="search" ref={searchContainerRef}>
        {isInputVisible && (
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onFocus={handleInputFocus}
            isSearchOpen={isSearchOpen}
            selectedIndex={selectedIndex}
          />
        )}

        <SearchToggleButton isInputVisible={isInputVisible} onToggle={handleToggleSearch} />

        {/* Live region para lectores de pantalla */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isSearching && "Buscando..."}
          {!isSearching &&
            searchResults.length > 0 &&
            `${searchResults.length} resultado${searchResults.length !== 1 ? "s" : ""} encontrado${searchResults.length !== 1 ? "s" : ""}`}
          {!isSearching && searchQuery && searchResults.length === 0 && hasSearched && "No se encontraron resultados"}
          {error && `Error: ${error}`}
        </div>

        {isSearchOpen && (error || isSearching || searchResults.length > 0 || hasSearched) && (
          <SearchResults
            results={searchResults}
            searchQuery={searchQuery}
            selectedIndex={selectedIndex}
            onResultClick={handleResultClick}
            getArticleUrl={getArticleUrl}
            renderHighlightedText={renderHighlightedText}
            error={error}
            isSearching={isSearching}
            hasSearched={hasSearched}
          />
        )}
      </div>

      {/*
        The id is the handle the accessibility and design suites reach the
        control by; the behaviour — set the attribute, persist it, notify the
        other tabs — is the library's.

        `onThemeChange` is NOT optional in practice, and that is a bug in
        arrecife 0.7.0, not a preference. The component's handler reads

            onClick={() => onThemeChange?.(toggleTheme())}

        and an optional call short-circuits its ARGUMENTS: with no
        `onThemeChange`, `toggleTheme()` is never evaluated and the button does
        nothing at all. Passing a handler is what makes the switch work. Worth
        reporting upstream — every consumer that omits the prop ships a dead
        control with no error anywhere.
      */}
      <ThemeToggle
        id="theme-toggle"
        aria-label="Cambiar entre modo claro y oscuro"
        onThemeChange={(theme) => trackEvent("theme_change", { theme })}
      />

      <MobileNav version={version} pathname={pathname} />
    </>
  );

  return (
    <Nav id="site-header" brand={brand} actions={actions}>
      {!isInputVisible && <NavLinks pathname={pathname} />}
    </Nav>
  );
}
