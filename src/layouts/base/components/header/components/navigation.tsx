import { useEffect, useRef, useState } from "react";

import NavLinks from "./nav-links";
import SearchInput from "./search-input";
import SearchResults from "./search-results";
import SearchToggleButton from "./search-toggle-button";
import { useAlgoliaSearch } from "./use-algolia-search";
import { useKeyboardNavigation } from "./use-keyboard-navigation";
import { getArticleUrl, renderHighlightedText } from "./utils";

interface NavigationProps {
  algolia?: {
    ALGOLIA_APPLICATION_ID?: string;
    ALGOLIA_INDEX_NAME?: string;
    ALGOLIA_ADMIN_API_KEY?: string;
  };
}

export default function Navigation({ algolia }: NavigationProps) {
  const [pathname, setPathname] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { searchResults, search } = useAlgoliaSearch(algolia);

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

    const hasResults = await search(query);
    setIsSearchOpen(hasResults ?? false);
  };

  const handleResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
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

  const handleArrowDown = () => {
    setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
  };

  const handleArrowUp = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
  };

  const handleEnter = () => {
    if (selectedIndex >= 0) {
      const selectedResult = searchResults[selectedIndex];
      const url = getArticleUrl(selectedResult);
      if (url && url !== "#") {
        window.location.href = url;
        handleResultClick();
      }
    }
  };

  const handleEscape = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSelectedIndex(-1);
  };

  useKeyboardNavigation({
    isSearchOpen,
    searchResults,
    selectedIndex,
    onArrowDown: handleArrowDown,
    onArrowUp: handleArrowUp,
    onEnter: handleEnter,
    onEscape: handleEscape,
  });

  return (
    <div className="hidden sm:flex gap-3 items-center relative" ref={searchContainerRef}>
      {!isInputVisible && <NavLinks pathname={pathname} />}

      <div className="relative ml-1 flex items-center">
        {isInputVisible && (
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            onFocus={handleInputFocus}
            onClear={handleClearSearch}
          />
        )}

        <SearchToggleButton isInputVisible={isInputVisible} onToggle={handleToggleSearch} />

        {isSearchOpen && searchResults.length > 0 && (
          <SearchResults
            results={searchResults}
            searchQuery={searchQuery}
            selectedIndex={selectedIndex}
            onResultClick={handleResultClick}
            getArticleUrl={getArticleUrl}
            renderHighlightedText={renderHighlightedText}
          />
        )}
      </div>
    </div>
  );
}
