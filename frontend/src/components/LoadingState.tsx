export default function LoadingState() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3.5">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="h-3 w-32 rounded bg-slate-200" />
          <div className="h-3 flex-1 rounded bg-slate-200" />
          <div className="h-5 w-20 rounded-full bg-slate-200" />
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="h-8 w-24 rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
