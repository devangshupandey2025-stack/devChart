import Navbar from "@/components/Navbar";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="space-y-6">
          {/* Top Row: Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 h-32 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 h-[350px] animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
              <div className="w-full h-full flex justify-center items-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 h-[350px] animate-pulse">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-4 bg-gray-200 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
