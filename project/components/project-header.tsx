import { Calendar, MoreHorizontal, Settings, Users } from "lucide-react";

export function ProjectHeader({ projectId }: { projectId: string }) {
  return (
    <div className="border-french_gray-300 dark:bg-outer_space-500 rounded-lg border bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center space-x-3">
            <div className="bg-blue_munsell-500 h-3 w-3 rounded-full" />
            <h1 className="text-outer_space-500 dark:text-platinum-500 text-2xl font-bold">
              Website Redesign
            </h1>
          </div>

          <p className="dark:text-french_gray-400 mb-4">
            Complete overhaul of company website with modern design and improved
            user experience
          </p>

          <div className="dark:text-french_gray-400 flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Users
                size={16}
                className="mr-2"
              />
              5 members
            </div>
            <div className="flex items-center">
              <Calendar
                size={16}
                className="mr-2"
              />
              Due Feb 15, 2024
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
              75% complete
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="hover:bg-platinum-500 rounded-lg p-2 transition-colors">
            <Settings size={20} />
          </button>
          <button className="hover:bg-platinum-500 rounded-lg p-2 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
