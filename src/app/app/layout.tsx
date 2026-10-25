import Sidebar from "@/components/app/Sidebar";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-dvh flex-col md:h-dvh md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 md:overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">{children}</div>
      </main>
    </div>
  );
}
