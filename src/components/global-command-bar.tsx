"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandPicker,
  type CommandPickerItem,
} from "@/components/command-picker";
import {
  LayoutDashboard,
  Folder,
  Users,
  Settings,
  ScrollText,
  ShieldAlert,
  FlaskConical,
  Activity,
  Megaphone,
  FileStack,
  ClipboardCheck,
  Flame,
  HardHat,
  Plus,
  type LucideIcon,
} from "lucide-react";

interface NavTarget {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: string;
  keywords: string[];
  icon: LucideIcon;
}

const NAV: NavTarget[] = [
  // Workspace
  { id: "dashboard", title: "Dashboard", subtitle: "Greeting + stats + recent", href: "/dashboard", category: "workspace", keywords: ["home", "overview"], icon: LayoutDashboard },
  { id: "tools", title: "Tools catalog", subtitle: "Every module ClickNComply offers", href: "/tools", category: "workspace", keywords: ["modules", "products"], icon: LayoutDashboard },
  { id: "documents", title: "My Documents", subtitle: "All saved RAMs, drafts and complete", href: "/tools/rams/documents", category: "workspace", keywords: ["docs", "library", "saved"], icon: ScrollText },
  { id: "projects", title: "Projects", subtitle: "Discrete jobs with auto-fill", href: "/projects", category: "workspace", keywords: ["jobs", "sites"], icon: Folder },
  { id: "clients", title: "Clients", subtitle: "Companies you deliver work for", href: "/clients", category: "workspace", keywords: ["customers", "companies"], icon: Users },
  { id: "account", title: "Account", subtitle: "Profile, organisation, billing", href: "/account", category: "workspace", keywords: ["settings", "profile", "billing", "subscription"], icon: Settings },

  // Quick create — RAMs builders
  { id: "new-full", title: "New Full RAMs", subtitle: "AI fills the long-form text from your tool selections", href: "/tools/rams/full", category: "create", keywords: ["start", "build", "all-in-one"], icon: FileStack },
  { id: "new-ms", title: "New Method Statement", subtitle: "Sequence of work, ready to send up the chain", href: "/tools/rams/method-statement", category: "create", keywords: ["ms", "method"], icon: ScrollText },
  { id: "new-ra", title: "New Risk Assessment", subtitle: "300+ pre-built hazards across 18 categories", href: "/tools/rams/risk-assessment", category: "create", keywords: ["ra", "risk", "hazards"], icon: ShieldAlert },
  { id: "new-coshh", title: "New COSHH Assessment", subtitle: "80+ pre-loaded substances", href: "/tools/rams/coshh", category: "create", keywords: ["chemical", "substance", "msds", "sds"], icon: FlaskConical },
  { id: "new-havs", title: "New HAVs Assessment", subtitle: "Vibration calculator + tool database", href: "/tools/rams/havs", category: "create", keywords: ["vibration", "hand arm"], icon: Activity },
  { id: "new-toolbox", title: "New Toolbox Talk", subtitle: "100+ pre-built topics", href: "/tools/rams/toolbox-talk", category: "create", keywords: ["briefing", "talk"], icon: Megaphone },
  { id: "new-permit", title: "New Permit to Work", subtitle: "Generic permit for any controlled activity", href: "/tools/rams/permit-to-work", category: "create", keywords: ["ptw"], icon: ClipboardCheck },
  { id: "new-hot", title: "New Hot Works Permit", subtitle: "Welding, cutting, grinding — fire watch protocol", href: "/tools/rams/hot-works-permit", category: "create", keywords: ["fire", "welding", "cutting"], icon: Flame },
  { id: "new-induction", title: "New Site Induction", subtitle: "For new starters joining site", href: "/tools/rams/site-induction", category: "create", keywords: ["onboarding", "starter"], icon: HardHat },
  { id: "new-puwer", title: "New PUWER Pre-Use Check", subtitle: "Operator-level visual + functional check", href: "/tools/rams/puwer-check", category: "create", keywords: ["plant", "inspection"], icon: ClipboardCheck },

  // Add new
  { id: "add-project", title: "Add a project", subtitle: "Discrete job with site address", href: "/projects?add=1", category: "actions", keywords: ["new project"], icon: Plus },
  { id: "add-client", title: "Add a client", subtitle: "New company you deliver to", href: "/clients?add=1", category: "actions", keywords: ["new client"], icon: Plus },
];

const CATEGORIES = [
  { id: "workspace", label: "Go to" },
  { id: "create", label: "Create new" },
  { id: "actions", label: "Add" },
];

/**
 * GlobalCommandBar — Cmd+K palette mounted at app shell level.
 *
 * Listens for Cmd+K / Ctrl+K and toggles. Fuzzy-search across every nav
 * destination + every "New …" action. Selecting routes the user.
 */
export function GlobalCommandBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items: CommandPickerItem[] = NAV.map((n) => ({
    id: n.id,
    title: n.title,
    subtitle: n.subtitle,
    category: n.category,
    keywords: n.keywords,
  }));

  return (
    <CommandPicker
      open={open}
      onOpenChange={setOpen}
      title="Jump to anywhere"
      subtitle="Type to search · Esc to close"
      items={items}
      categories={CATEGORIES}
      searchPlaceholder="Search pages, builders, actions…"
      onPick={(item) => {
        const target = NAV.find((n) => n.id === item.id);
        if (target) router.push(target.href);
      }}
    />
  );
}
