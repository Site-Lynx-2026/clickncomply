"use client";

import { Check } from "lucide-react";

export function SaveStatus({
  saving,
  lastSaved,
}: {
  saving: boolean;
  lastSaved: string;
}) {
  if (saving) {
    return <p className="text-xs text-muted-foreground">Saving…</p>;
  }
  if (lastSaved) {
    return (
      <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
        <Check className="size-3 text-foreground" />
        Saved at {lastSaved}
      </p>
    );
  }
  return null;
}
