"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function useMobileSidebar() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const previousBodyOverflow = useRef<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((value) => !value), []);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    function handleChange() {
      setIsMobileViewport(mediaQuery.matches);
    }

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isMobileViewport) {
      return;
    }

    previousBodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow.current ?? "";
      previousBodyOverflow.current = null;
    };
  }, [isMobileViewport, isOpen]);

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}
