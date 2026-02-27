import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useKeyboardNavigation } from "../../../../../../../src/layouts/base/components/header/components/use-keyboard-navigation";

const defaultProps = {
  isSearchOpen: true,
  searchResults: [],
  selectedIndex: -1,
  onArrowDown: vi.fn(),
  onArrowUp: vi.fn(),
  onEnter: vi.fn(),
  onEscape: vi.fn(),
};

describe("useKeyboardNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Limpiar cualquier listener residual
    vi.clearAllMocks();
  });

  it("llama a onArrowDown al presionar ArrowDown", () => {
    const onArrowDown = vi.fn();
    renderHook(() => useKeyboardNavigation({ ...defaultProps, onArrowDown }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));

    expect(onArrowDown).toHaveBeenCalledTimes(1);
  });

  it("llama a onArrowUp al presionar ArrowUp", () => {
    const onArrowUp = vi.fn();
    renderHook(() => useKeyboardNavigation({ ...defaultProps, onArrowUp }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));

    expect(onArrowUp).toHaveBeenCalledTimes(1);
  });

  it("llama a onEnter al presionar Enter", () => {
    const onEnter = vi.fn();
    renderHook(() => useKeyboardNavigation({ ...defaultProps, onEnter }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));

    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it("llama a onEscape al presionar Escape", () => {
    const onEscape = vi.fn();
    renderHook(() => useKeyboardNavigation({ ...defaultProps, onEscape }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("no llama a ningún callback cuando isSearchOpen es false", () => {
    const onArrowDown = vi.fn();
    const onArrowUp = vi.fn();
    const onEnter = vi.fn();
    const onEscape = vi.fn();

    renderHook(() =>
      useKeyboardNavigation({
        ...defaultProps,
        isSearchOpen: false,
        onArrowDown,
        onArrowUp,
        onEnter,
        onEscape,
      }),
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onArrowDown).not.toHaveBeenCalled();
    expect(onArrowUp).not.toHaveBeenCalled();
    expect(onEnter).not.toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("no llama a ningún callback para otras teclas", () => {
    const onArrowDown = vi.fn();
    renderHook(() => useKeyboardNavigation({ ...defaultProps, onArrowDown }));

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    expect(onArrowDown).not.toHaveBeenCalled();
  });

  it("llama a preventDefault al presionar ArrowDown", () => {
    renderHook(() => useKeyboardNavigation(defaultProps));

    const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("llama a preventDefault al presionar ArrowUp", () => {
    renderHook(() => useKeyboardNavigation(defaultProps));

    const event = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("elimina el event listener al desmontar el componente", () => {
    const onArrowDown = vi.fn();
    const { unmount } = renderHook(() => useKeyboardNavigation({ ...defaultProps, onArrowDown }));

    unmount();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(onArrowDown).not.toHaveBeenCalled();
  });
});
