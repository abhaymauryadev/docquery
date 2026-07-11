export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink">
      <div className="max-w-2xl rounded-(--radius-card) border border-graphite/10 bg-white p-12 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">DocQuery landing page test</h1>
        <p className="mt-4 text-sm text-graphite">
          If you see this, the root app page is working.
        </p>
      </div>
    </div>
  );
}
