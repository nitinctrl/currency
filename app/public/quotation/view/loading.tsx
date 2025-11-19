import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            {/* Header skeleton */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-16 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse ml-auto" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto" />
              </div>
            </div>

            {/* Quotation For skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Table skeleton */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* Totals skeleton */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
