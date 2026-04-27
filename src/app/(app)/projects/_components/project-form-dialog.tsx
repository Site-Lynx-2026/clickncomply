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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProjectAction, updateProjectAction } from "../actions";
import type { Database } from "@/types/supabase";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ClientRow = Database["public"]["Tables"]["clients"]["Row"];

interface Props {
  mode: "create" | "edit";
  project?: ProjectRow;
  clients: ClientRow[];
  open?: boolean;
  children?: React.ReactNode;
}

export function ProjectFormDialog({
  mode,
  project,
  clients,
  open: controlledOpen,
  children,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(controlledOpen ?? false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : open;

  function handleOpenChange(next: boolean) {
    if (controlledOpen !== undefined) {
      if (!next) router.push("/projects");
    } else {
      setOpen(next);
    }
  }

  const action =
    mode === "edit" && project
      ? updateProjectAction.bind(null, project.id)
      : createProjectAction;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit project" : "New project"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the project details."
              : "Set up a project. Every doc you build for it will auto-fill the site details."}
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={project?.name ?? ""}
                placeholder="Rivermark Block D"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Job no.</Label>
              <Input
                id="code"
                name="code"
                defaultValue={project?.code ?? ""}
                placeholder="21639"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client_id">Client</Label>
            <Select
              name="client_id"
              defaultValue={project?.client_id ?? "_none"}
            >
              <SelectTrigger id="client_id">
                <SelectValue placeholder="No client (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">No client</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Link to a client so docs can carry their branding & details.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="site_address">Site address</Label>
              <Input
                id="site_address"
                name="site_address"
                defaultValue={project?.site_address ?? ""}
                placeholder="123 Site Lane, Anywhere"
                autoComplete="street-address"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site_postcode">Postcode</Label>
              <Input
                id="site_postcode"
                name="site_postcode"
                defaultValue={project?.site_postcode ?? ""}
                placeholder="SW1A 1AA"
                autoComplete="postal-code"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start_date">Start date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={project?.start_date ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_date">End date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={project?.end_date ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={project?.status ?? "active"}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              defaultValue={project?.notes ?? ""}
              placeholder="Anything worth remembering about this job"
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
              {mode === "edit" ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
