"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Database } from "@/types/supabase";

export type ProjectRow =
  Database["public"]["Tables"]["projects"]["Row"];

interface ProjectsContextValue {
  projects: ProjectRow[];
  selectedProjectId: string | null;
  selectedProject: ProjectRow | null;
  setSelectedProjectId: (id: string | null) => void;
}

const Context = createContext<ProjectsContextValue | null>(null);

export function ProjectsProvider({
  initialProjects,
  children,
}: {
  initialProjects: ProjectRow[];
  children: ReactNode;
}) {
  const [selectedProjectId, setSelectedProjectIdState] = useState<string | null>(
    null
  );

  const setSelectedProjectId = useCallback((id: string | null) => {
    setSelectedProjectIdState(id);
  }, []);

  const selectedProject = useMemo(
    () => initialProjects.find((p) => p.id === selectedProjectId) ?? null,
    [initialProjects, selectedProjectId]
  );

  const value = useMemo<ProjectsContextValue>(
    () => ({
      projects: initialProjects,
      selectedProjectId,
      selectedProject,
      setSelectedProjectId,
    }),
    [initialProjects, selectedProjectId, selectedProject, setSelectedProjectId]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return ctx;
}
