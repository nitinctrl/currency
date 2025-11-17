export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse p-8">
      <div className="h-8 w-48 bg-muted rounded" />
      
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="h-4 w-32 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="h-64 w-full bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
