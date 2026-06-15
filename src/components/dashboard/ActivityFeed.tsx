import { formatDistanceToNow } from "date-fns";

interface Activity {
  _id: string;
  action: string;
  createdAt: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No recent activity.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
          {activities.map((activity, idx) => (
            <div key={activity._id} className="relative pl-6">
              {/* Timeline Dot */}
              <div className="absolute w-3 h-3 bg-teal-400 rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
              
              <div className="flex flex-col">
                <p className="text-sm text-gray-700">
                  Someone <span className="font-medium text-gray-900">{activity.action}</span>
                </p>
                <span className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
