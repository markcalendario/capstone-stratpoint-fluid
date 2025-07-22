import {
  ArrowLeft,
  Settings,
  Users,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/projects"
              className="rounded-lg p-2 transition-colors hover:bg-platinum-500 dark:hover:bg-payne's_gray-400">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
                Project #{params.id}
              </h1>
              <p className="mt-1 text-payne's_gray-500 dark:text-french_gray-500">
                Kanban board view for project management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="rounded-lg p-2 transition-colors hover:bg-platinum-500 dark:hover:bg-payne's_gray-400">
              <Users size={20} />
            </button>
            <button className="rounded-lg p-2 transition-colors hover:bg-platinum-500 dark:hover:bg-payne's_gray-400">
              <Calendar size={20} />
            </button>
            <button className="rounded-lg p-2 transition-colors hover:bg-platinum-500 dark:hover:bg-payne's_gray-400">
              <Settings size={20} />
            </button>
            <button className="rounded-lg p-2 transition-colors hover:bg-platinum-500 dark:hover:bg-payne's_gray-400">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
            🎯 Kanban Board Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Task 5.1: Design responsive Kanban board layout</li>
            <li>
              • Task 5.2: Implement drag-and-drop functionality with dnd-kit
            </li>
            <li>
              • Task 5.4: Implement optimistic UI updates for smooth
              interactions
            </li>
            <li>
              • Task 5.6: Create task detail modals and editing interfaces
            </li>
          </ul>
        </div>

        {/* Kanban Board Placeholder */}
        <div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {["To Do", "In Progress", "Review", "Done"].map(
              (columnTitle, columnIndex) => (
                <div
                  key={columnTitle}
                  className="w-80 flex-shrink-0">
                  <div className="rounded-lg border border-french_gray-300 bg-platinum-800 dark:border-payne's_gray-400 dark:bg-outer_space-400">
                    <div className="border-b border-french_gray-300 p-4 dark:border-payne's_gray-400">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500">
                          {columnTitle}
                          <span className="ml-2 rounded-full bg-french_gray-300 px-2 py-1 text-xs dark:bg-payne's_gray-400">
                            {Math.floor(Math.random() * 5) + 1}
                          </span>
                        </h3>
                        <button className="rounded p-1 hover:bg-platinum-500 dark:hover:bg-payne's_gray-400">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="min-h-[400px] space-y-3 p-4">
                      {[1, 2, 3].map((taskIndex) => (
                        <div
                          key={taskIndex}
                          className="cursor-pointer rounded-lg border border-french_gray-300 bg-white p-4 transition-shadow hover:shadow-md dark:border-payne's_gray-400 dark:bg-outer_space-300">
                          <h4 className="mb-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500">
                            Sample Task {taskIndex}
                          </h4>
                          <p className="mb-3 text-xs text-payne's_gray-500 dark:text-french_gray-400">
                            This is a placeholder task description
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-blue_munsell-100 px-2 py-1 text-xs font-medium text-blue_munsell-700 dark:bg-blue_munsell-900 dark:text-blue_munsell-300">
                              Medium
                            </span>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue_munsell-500 text-xs font-semibold text-white">
                              U
                            </div>
                          </div>
                        </div>
                      ))}

                      <button className="w-full rounded-lg border-2 border-dashed border-french_gray-300 p-3 text-payne's_gray-500 transition-colors hover:border-blue_munsell-500 hover:text-blue_munsell-500 dark:border-payne's_gray-400 dark:text-french_gray-400">
                        + Add task
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Component Implementation Guide */}
        <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800/50">
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            🛠️ Components & Features to Implement
          </h3>
          <div className="grid grid-cols-1 gap-6 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-2">
            <div>
              <strong className="mb-2 block">Core Components:</strong>
              <ul className="list-inside list-disc space-y-1">
                <li>components/kanban-board.tsx</li>
                <li>components/task-card.tsx</li>
                <li>components/modals/create-task-modal.tsx</li>
                <li>stores/board-store.ts (Zustand)</li>
              </ul>
            </div>
            <div>
              <strong className="mb-2 block">Advanced Features:</strong>
              <ul className="list-inside list-disc space-y-1">
                <li>Drag & drop with @dnd-kit/core</li>
                <li>Real-time updates</li>
                <li>Task assignments & due dates</li>
                <li>Comments & activity history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
