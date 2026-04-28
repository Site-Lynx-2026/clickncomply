import { redirect } from "next/navigation";

/**
 * /tools — historically a "module catalog" listing every product line
 * (RAMs / QA / Permits / Plant / etc.). Today RAMs is the only live
 * module, so the catalog is a dead-weight click for daily users.
 *
 * The catalog is gone from the app. Future modules will surface as
 * sidebar entries on a per-org-activation basis when they're real, not
 * as marketing tiles inside a logged-in catalog.
 */
export default function ToolsRedirect() {
  redirect("/tools/rams");
}
