"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SendDialog } from "./send-dialog";

interface SendButtonProps {
  docId: string | null;
  docTypeLabel: string;
  /** Disabled while the doc isn't saved yet (no id to send). */
  disabled?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary" | "ghost";
}

/**
 * Drop-in "Send to client" button for builder action bars. When the doc
 * hasn't been saved yet, the button is disabled — there's nothing to send.
 *
 * Pairs the SendDialog primitive so each builder gets one-line wiring.
 */
export function SendButton({
  docId,
  docTypeLabel,
  disabled,
  size = "sm",
  variant = "outline",
}: SendButtonProps) {
  const [open, setOpen] = useState(false);
  const isDisabled = disabled || !docId;

  return (
    <>
      <Button
        type="button"
        size={size}
        variant={variant}
        onClick={() => setOpen(true)}
        disabled={isDisabled}
        title={isDisabled ? "Save the doc first" : "Email this to a client"}
        className="gap-1.5"
      >
        <Send className="size-3.5" />
        Send
      </Button>
      {docId && (
        <SendDialog
          open={open}
          onOpenChange={setOpen}
          docId={docId}
          docTypeLabel={docTypeLabel}
        />
      )}
    </>
  );
}
