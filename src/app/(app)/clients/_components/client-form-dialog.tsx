"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClientAction, updateClientAction } from "../actions";
import type { Database } from "@/types/supabase";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];

interface Props {
  mode: "create" | "edit";
  client?: ClientRow;
  open?: boolean;
  children?: React.ReactNode;
}

export function ClientFormDialog({ mode, client, open: controlledOpen, children }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(controlledOpen ?? false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : open;

  function handleOpenChange(next: boolean) {
    if (controlledOpen !== undefined) {
      // Controlled: navigate away to clear the URL param that opened us
      if (!next) {
        router.push("/clients");
      }
    } else {
      setOpen(next);
    }
  }

  const action = mode === "edit" && client
    ? updateClientAction.bind(null, client.id)
    : createClientAction;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit client" : "Add client"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the client's details."
              : "Add a company you deliver work for."}
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Company name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={client?.name ?? ""}
              placeholder="Taylor Wimpey"
              autoComplete="organization"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact_name">Contact name</Label>
              <Input
                id="contact_name"
                name="contact_name"
                defaultValue={client?.contact_name ?? ""}
                placeholder="Sarah Patel"
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                defaultValue={client?.contact_phone ?? ""}
                placeholder="+44 …"
                autoComplete="tel"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={client?.contact_email ?? ""}
              placeholder="sarah@taylorwimpey.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              rows={2}
              defaultValue={client?.address ?? ""}
              placeholder="One-line or multi-line"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              defaultValue={client?.notes ?? ""}
              placeholder="Anything you want to remember about them"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "edit" ? "Save changes" : "Add client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
