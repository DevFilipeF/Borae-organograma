import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventosLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-blue-50">
      {/* Header Skeleton */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-14 w-14 rounded-xl" />
            </div>
            <nav className="hidden lg:flex items-center space-x-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </nav>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Header da Página Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-16" />
            <div>
              <Skeleton className="h-12 w-48 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
          </div>
          <Skeleton className="h-12 w-80 rounded-xl" />
        </div>

        {/* Lista de Eventos Skeleton */}
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <div className="space-y-3 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
