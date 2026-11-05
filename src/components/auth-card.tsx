import { SiteHeader } from "@/components/site-header";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="flex flex-1 items-start justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-zinc-600">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
