import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "./actions";
import {
  AppSidebar,
  AppSidebarMobileTrigger,
} from "./_components/app-sidebar";
import { GlobalCommandBar } from "@/components/global-command-bar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 min-h-screen">
      <AppSidebar
        userEmail={user.email ?? ""}
        logoutAction={logoutAction}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <AppSidebarMobileTrigger
          userEmail={user.email ?? ""}
          logoutAction={logoutAction}
        />
        <main className="flex-1 surface-canvas">{children}</main>
      </div>
      <GlobalCommandBar />
    </div>
  );
}
