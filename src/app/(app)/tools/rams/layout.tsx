import { RAMsSidebar } from "./_components/sidebar";

export const metadata = {
  title: "RAMs Builder — ClickNComply",
};

export default function RAMsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
      <RAMsSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
