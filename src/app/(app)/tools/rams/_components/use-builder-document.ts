"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useProjects } from "./projects-context";

/**
 * Generic builder-document hook. Handles:
 *   - Loading from ?doc=<id> if present
 *   - Auto-saving 1.5s after the last edit
 *   - Save status indicator
 *   - PDF download
 *   - Project linkage via the ProjectsProvider context (every save persists
 *     the currently-selected project_id; loading a doc with project_id
 *     pre-selects that project in the picker).
 *
 * Each builder calls this with its own builder_slug + initial form factory,
 * and gets back { form, update, docId, saveStatus, downloadPdf, manualSave }.
 *
 * The hook is intentionally builder-agnostic — the only contract is that
 * the form is a JSON-serialisable object that the matching PDF template
 * + AI tasks know how to read.
 */

type LastSavedTime = string;

export interface UseBuilderDocumentOptions<TForm extends object> {
  builderSlug: string;
  /** Returns the form's "fresh state" — used when no document is loaded. */
  emptyForm: () => TForm;
  /** Optional accessor that pulls a `title` field out of form_data for the row. */
  titleFromForm?: (form: TForm) => string | null;
}

export interface UseBuilderDocumentResult<TForm extends object> {
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  update: (patch: Partial<TForm>) => void;
  docId: string | null;
  saving: boolean;
  lastSaved: LastSavedTime;
  downloading: boolean;
  /** Force a save right now (used by explicit Save buttons). */
  manualSave: () => Promise<void>;
  /** Open the rendered PDF in a new tab. */
  downloadPdf: () => Promise<void>;
}

export function useBuilderDocument<TForm extends object>({
  builderSlug,
  emptyForm,
  titleFromForm,
}: UseBuilderDocumentOptions<TForm>): UseBuilderDocumentResult<TForm> {
  const [form, setForm] = useState<TForm>(emptyForm);
  const [docId, setDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<LastSavedTime>("");
  const [downloading, setDownloading] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);
  // Authoritative copy of docId for callbacks — refreshed inside persist().
  const docIdRef = useRef<string | null>(null);

  // Project linkage via context.
  const { selectedProjectId, setSelectedProjectId } = useProjects();
  // Keep an authoritative ref so persist() always sees the latest value
  // even if it's mid-await when the user picks a different project.
  const selectedProjectIdRef = useRef<string | null>(selectedProjectId);
  useEffect(() => {
    selectedProjectIdRef.current = selectedProjectId;
  }, [selectedProjectId]);

  /**
   * Persist a form snapshot.
   *
   * Returns the resolved doc id (newly minted on first save, otherwise the
   * existing id). Callers that need to act on a brand-new doc immediately
   * (e.g. downloadPdf when no docId is set yet) should use this return value
   * rather than reading state — state updates are async.
   */
  const persist = useCallback(
    async (next: TForm, currentId: string | null): Promise<string | null> => {
      setSaving(true);
      try {
        const title =
          (titleFromForm ? titleFromForm(next) : null) || null;
        const projectId = selectedProjectIdRef.current;
        const payload = {
          title,
          form_data: next as unknown as Record<string, unknown>,
          project_id: projectId,
        };
        let res: Response;
        let resolvedId: string | null = currentId;

        if (currentId) {
          res = await fetch(`/api/rams/${currentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          res = await fetch(`/api/rams`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ builder_slug: builderSlug, ...payload }),
          });
          if (res.ok) {
            const { id } = await res.json();
            resolvedId = id as string;
            docIdRef.current = id as string;
            setDocId(id);
            // Replace URL so a refresh resumes the draft.
            const url = new URL(window.location.href);
            url.searchParams.set("doc", id);
            window.history.replaceState(null, "", url.toString());
          }
        }
        if (!res.ok) throw new Error(await res.text());
        setLastSaved(
          new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        dirty.current = false;
        return resolvedId;
      } catch {
        toast.error("Couldn't save — check your connection.");
        return null;
      } finally {
        setSaving(false);
      }
    },
    [builderSlug, titleFromForm]
  );

  // Trigger auto-save when the project picker changes (after first save).
  // Until first save, project changes just queue up — they get persisted
  // alongside the next field edit or manual save.
  useEffect(() => {
    if (!docIdRef.current) return;
    // Mark dirty + reset timer so project change persists alongside any
    // pending field edits without a separate network call.
    dirty.current = true;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (dirty.current) persist(form, docIdRef.current);
    }, 800);
    // form intentionally left out — we only re-arm on project change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  function update(patch: Partial<TForm>) {
    setForm((f) => {
      const next = { ...f, ...patch } as TForm;
      dirty.current = true;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        if (dirty.current) persist(next, docIdRef.current);
      }, 1500);
      return next;
    });
  }

  // Load from ?doc=<id> on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("doc");
    if (!id) return;
    let cancelled = false;
    fetch(`/api/rams/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (cancelled) return;
        if (doc?.form_data) {
          docIdRef.current = id;
          setDocId(id);
          setForm({ ...emptyForm(), ...doc.form_data });
          // Pre-select the doc's project in the picker, if it had one.
          if (doc.project_id) {
            setSelectedProjectId(doc.project_id);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // Intentional: only run on mount. emptyForm should be stable per builder.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup pending save on unmount.
  useEffect(
    () => () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    },
    []
  );

  async function manualSave() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    await persist(form, docIdRef.current);
  }

  async function downloadPdf() {
    let id = docIdRef.current ?? docId;
    if (!id) {
      // Force a save first so we have an id to render against.
      // Use persist's return value directly — don't read state which is async.
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      const saved = await persist(form, null);
      id = saved;
      if (!id) {
        // persist already toasted the error
        return;
      }
    }
    setDownloading(true);
    try {
      const res = await fetch(`/api/rams/${id}/pdf`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "PDF generation failed.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 30_000);

      // First-PDF celebration — fired once per device using localStorage.
      // Stripe / Cal.com pattern: the moment of value gets celebrated +
      // gets a tiny viral CTA.
      try {
        if (!localStorage.getItem("cnc-first-pdf")) {
          localStorage.setItem("cnc-first-pdf", new Date().toISOString());
          toast.success("Your first compliance PDF is on its way 🎉", {
            description:
              "That used to take an hour. Want to share ClickNComply and get a free month?",
            action: {
              label: "Share",
              onClick: () => {
                const text = encodeURIComponent(
                  "Just wrote a full RAMS in five minutes with @clickncomply — £2/mo, no consultant. clickncomply.co.uk"
                );
                window.open(
                  `https://twitter.com/intent/tweet?text=${text}`,
                  "_blank"
                );
              },
            },
            duration: 8000,
          });
        }
      } catch {
        // localStorage blocked — fail silent, the PDF still opened
      }
    } catch {
      toast.error("PDF generation failed.");
    } finally {
      setDownloading(false);
    }
  }

  return {
    form,
    setForm,
    update,
    docId,
    saving,
    lastSaved,
    downloading,
    manualSave,
    downloadPdf,
  };
}
