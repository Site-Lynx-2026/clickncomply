"use client";

import { useEffect, useRef } from "react";
import { useProjects, type ProjectRow } from "./projects-context";

/**
 * Autofill builder fields when the user picks a project.
 *
 * Usage:
 *   useProjectAutofill({
 *     form,
 *     update,
 *     map: (project) => ({
 *       siteName: project.name,
 *       siteAddress: combineAddress(project),
 *       dateOfWorks: project.start_date ?? "",
 *     }),
 *   });
 *
 * Behaviour:
 *   - Only fires when the selected project ID actually CHANGES.
 *   - Only fills fields that are currently EMPTY in the form — never
 *     clobbers user-edited values.
 *   - Skips on first render when restoring an existing doc (the doc was
 *     already saved with whatever values; auto-fill only fires after a
 *     deliberate picker change).
 */
export function useProjectAutofill<TForm extends object>({
  form,
  update,
  map,
}: {
  form: TForm;
  update: (patch: Partial<TForm>) => void;
  map: (project: ProjectRow) => Partial<TForm>;
}) {
  const formAsRecord = form as unknown as Record<string, unknown>;
  const { selectedProject } = useProjects();
  const prevProjectIdRef = useRef<string | null>(null);
  // Skip the very first render — we don't want autofill firing while we're
  // still restoring a previously-saved doc (which set selectedProject from
  // the doc row, not from a deliberate user pick).
  const initialisedRef = useRef(false);

  useEffect(() => {
    if (!initialisedRef.current) {
      initialisedRef.current = true;
      prevProjectIdRef.current = selectedProject?.id ?? null;
      return;
    }
    const newId = selectedProject?.id ?? null;
    if (newId === prevProjectIdRef.current) return;
    prevProjectIdRef.current = newId;

    if (!selectedProject) return;

    // Build the candidate patch
    const candidate = map(selectedProject);

    // Filter — only set fields that are currently empty.
    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(candidate)) {
      const current = formAsRecord[key];
      const currentIsEmpty =
        current === undefined ||
        current === null ||
        (typeof current === "string" && current.trim().length === 0);
      if (currentIsEmpty && value !== undefined && value !== null && value !== "") {
        patch[key] = value;
      }
    }

    if (Object.keys(patch).length > 0) {
      update(patch as Partial<TForm>);
    }
    // form intentionally omitted — re-running on every form keystroke is wrong.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, update, map]);
}

/**
 * Common helper — combines site_address + postcode into a single string.
 */
export function combineAddress(project: ProjectRow): string {
  const parts: string[] = [];
  if (project.site_address) parts.push(project.site_address);
  if (project.site_postcode) parts.push(project.site_postcode);
  return parts.join(", ");
}
