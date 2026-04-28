"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SendDialogProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  docId: string;
  /** What kind of doc we're sending — used in the dialog blurb. */
  docTypeLabel: string;
  /** Pre-fill recipient — typically from the doc's project's client. */
  defaultTo?: string;
  defaultToName?: string;
}

/**
 * "Send to client" dialog.
 *
 * The recipient gets a branded email from the firm with the PDF attached
 * and a link back to the firm's public share page. The dialog itself is
 * intentionally tiny — three fields and a Send button. The hard work
 * (PDF render + Resend send + audit row) all happens server-side.
 */
export function SendDialog({
  open,
  onOpenChange,
  docId,
  docTypeLabel,
  defaultTo,
  defaultToName,
}: SendDialogProps) {
  const [to, setTo] = useState(defaultTo ?? "");
  const [toName, setToName] = useState(defaultToName ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!to.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/docs/${docId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim(),
          toName: toName.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Couldn't send the email.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.simulated) {
        toast.success(
          "Sent (dev mode — no real email; Resend isn't configured)."
        );
      } else {
        toast.success(`Sent to ${to.trim()}.`);
      }
      onOpenChange(false);
      setMessage("");
    } catch {
      toast.error("Couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="size-4" strokeWidth={2} />
            Send to client
          </DialogTitle>
          <DialogDescription>
            Sends the {docTypeLabel} as a PDF attachment, branded with your
            company name in the From.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="send-to" className="text-xs">
                Recipient email
              </Label>
              <Input
                id="send-to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="contact@example.co.uk"
                autoComplete="email"
                spellCheck={false}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="send-to-name" className="text-xs">
                Name
              </Label>
              <Input
                id="send-to-name"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                placeholder="Optional"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="send-message" className="text-xs">
              Personal message (optional)
            </Label>
            <Textarea
              id="send-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder={`e.g. "Here's the ${docTypeLabel.toLowerCase()} for plot 12 as discussed."`}
            />
            <p className="text-[10px] text-muted-foreground">
              {message.length}/1000
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={submit}
            disabled={!to.trim() || busy}
            className="gap-1.5"
          >
            {busy ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                Send
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
