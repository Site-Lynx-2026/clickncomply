"use client";

import { Command } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * CommandKHint — the always-on chip in the top nav that reminds users
 * Cmd+K is alive. Auto-detects platform (Cmd on Mac, Ctrl elsewhere).
 *
 * The Linear / Stripe pattern: discoverable shortcut, no banner needed.
 */
export function CommandKHint() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  function open() {
    // Dispatch the same Cmd+K key event the GlobalCommandBar listens for.
    const evt = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    window.dispatchEvent(evt);
  }

  return (
    <button
      type="button"
      onClick={open}
      className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md surface-pebble border border-soft text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:border-strong transition"
      aria-label="Open command bar"
      title="Open command bar"
    >
      <Command className="size-3" />
      <span className="font-mono-num">K</span>
      <span className="text-muted-foreground/60 normal-case tracking-normal font-medium">
        jump
      </span>
    </button>
  );
}
