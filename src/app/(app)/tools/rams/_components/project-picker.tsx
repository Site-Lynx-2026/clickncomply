"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Plus, Check } from "@/lib/icons";
import { Folder } from "lucide-react";
import { useProjects } from "./projects-context";
import { cn } from "@/lib/utils";

/**
 * Project picker shown above every builder. When the user selects a project,
 * useBuilderDocument persists `project_id` on the doc, and individual
 * builders that want auto-fill use a useEffect to read selectedProject and
 * populate their site fields.
 *
 * Empty state (no projects yet) → CTA to create one.
 */
export function ProjectPicker() {
  const { projects, selectedProject, setSelectedProjectId } = useProjects();

  if (projects.length === 0) {
    return (
      <div className="border rounded-lg px-3 py-2 flex items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Folder className="size-4" />
          <span>No project linked</span>
          <span className="text-xs">·</span>
          <span className="text-xs">
            Create a project to auto-fill site address, dates, client.
          </span>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/projects?add=1">
            <Plus className="size-3.5 mr-1" />
            New project
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="justify-between min-w-[260px] max-w-md"
          >
            <span className="flex items-center gap-2 min-w-0">
              <Folder className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">
                {selectedProject ? (
                  <>
                    <span className="font-medium">{selectedProject.name}</span>
                    {selectedProject.code && (
                      <span className="text-muted-foreground ml-1.5 font-mono text-xs">
                        {selectedProject.code}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground">No project — pick one</span>
                )}
              </span>
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[320px]" align="start">
          <div className="max-h-72 overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2 border-b",
                !selectedProject && "bg-muted/30 font-medium"
              )}
            >
              <Check
                className={cn(
                  "size-3.5",
                  !selectedProject ? "opacity-100" : "opacity-0"
                )}
              />
              <span className="text-muted-foreground">No project</span>
            </button>
            {projects.map((p) => {
              const isSelected = selectedProject?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProjectId(p.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-start gap-2",
                    isSelected && "bg-muted/30"
                  )}
                >
                  <Check
                    className={cn(
                      "size-3.5 mt-0.5 shrink-0",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{p.name}</span>
                      {p.code && (
                        <span className="text-muted-foreground font-mono text-xs shrink-0">
                          {p.code}
                        </span>
                      )}
                    </div>
                    {p.site_address && (
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {p.site_address}
                        {p.site_postcode && ` · ${p.site_postcode}`}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="border-t p-2">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="w-full justify-start"
            >
              <Link href="/projects?add=1">
                <Plus className="size-3.5 mr-1.5" />
                New project
              </Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
