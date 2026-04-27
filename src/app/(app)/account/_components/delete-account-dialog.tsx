"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "../actions";

/**
 * GDPR delete-account dialog with typed confirmation. Requires the user to
 * type their email to confirm — defends against accidental clicks.
 */
export function DeleteAccountDialog({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");

  const matches = typed.trim().toLowerCase() === email.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete my account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This is permanent. Your name and avatar will be scrubbed
            immediately. Your account will be deleted from Supabase.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            What happens:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>You will be signed out and unable to log in again with this email.</li>
            <li>Your profile (name, avatar) is permanently scrubbed.</li>
            <li>Documents you authored remain with the organisation but are no longer attributable to you.</li>
            <li>If you&apos;re the sole owner of an organisation, the organisation persists for now — email{" "}
              <a
                href="mailto:hello@clickncomply.co.uk"
                className="underline underline-offset-2 hover:text-foreground"
              >
                hello@clickncomply.co.uk
              </a>{" "}
              if you want full org deletion.
            </li>
          </ul>
          <div className="space-y-1.5 pt-2 border-t">
            <Label htmlFor="confirm-email">
              Type <span className="font-mono">{email}</span> to confirm
            </Label>
            <Input
              id="confirm-email"
              type="email"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={email}
              autoComplete="off"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <form action={deleteAccountAction}>
            <Button type="submit" variant="destructive" disabled={!matches}>
              Permanently delete
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
