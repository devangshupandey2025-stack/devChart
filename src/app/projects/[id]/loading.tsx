import Navbar from "@/components/Navbar";

export default function KanbanLoading() {
  return (
    <div className="flex flex-col h-screen bg-gray-50/30">
      <Navbar />
      <div className="p-8 flex flex-col h-full">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-3" />
          <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse" />
        </div>

        {/* Toolbar Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="h-10 w-full md:w-96 bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Board Columns Skeleton */}
        <div className="flex gap-6 overflow-x-hidden flex-1">
          {[1, 2, 3].map((col) => (
            <div key={col} className="flex flex-col flex-1 bg-gray-50/80 rounded-2xl p-4 min-w-[300px] border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-6 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((card) => (
                  <div key={card} className="bg-white p-4 rounded-xl border border-gray-100 h-32 animate-pulse">
                    <div className="h-4 w-12 bg-gray-200 rounded-full mb-3" />
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                      <div className="h-6 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
