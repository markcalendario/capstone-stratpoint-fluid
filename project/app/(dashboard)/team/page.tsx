import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import TeamCard from "@/components/team-card";
import TeamCard from "@/components/team-card";

export default function TeamPage() {
  return (
    <DashboardContent
      title="Team"
      description="Manage team members and permissions">
      <div className="space-y-6">
        {/* Implementation Tasks Banner */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
            📋 Team Management Implementation Tasks
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            <li>
              • Task 6.1: Implement task assignment and user collaboration
              features
            </li>
            <li>
              • Task 6.4: Implement project member management and permissions
            </li>
          </ul>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          asd
          {[
            {
              name: "John Doe",
              role: "Project Manager",
              email: "john@example.com",
              projectsCount: 3,
              profilePictureUrl: "/placeholder-user.jpg"
              projectsCount: 3,
              profilePictureUrl: "/placeholder-user.jpg"
            },
            {
              name: "Jane Smith",
              role: "Developer",
              email: "jane@example.com",
              projectsCount: 4,
              profilePictureUrl: "/placeholder-user.jpg"
              projectsCount: 4,
              profilePictureUrl: "/placeholder-user.jpg"
            },
            {
              name: "Mike Johnson",
              role: "Designer",
              email: "mike@example.com",
              projectsCount: 5,
              profilePictureUrl: "/placeholder-user.jpg"
              projectsCount: 5,
              profilePictureUrl: "/placeholder-user.jpg"
            },
            {
              name: "Sarah Wilson",
              role: "Developer",
              email: "sarah@example.com",
              projectsCount: 6,
              profilePictureUrl: "/placeholder-user.jpg"
              projectsCount: 6,
              profilePictureUrl: "/placeholder-user.jpg"
            },
            {
              name: "Tom Brown",
              role: "QA Engineer",
              email: "tom@example.com",
              projectsCount: 7,
              profilePictureUrl: "/placeholder-user.jpg"
            },
            {
              name: "Lisa Davis",
              role: "Designer",
              email: "lisa@example.com",
              projectsCount: 8,
              profilePictureUrl: "/placeholder-user.jpg"
            }
          ].map((member, i) => (
            <TeamCard
              key={i}
              name={member.name}
              role={member.role}
              email={member.email}
              projectsCount={member.projectsCount}
              profilePictureUrl={member.profilePictureUrl}
              className="bg-white p-6 dark:bg-neutral-800"
            />
          ))}
        </div>
      </div>
    </DashboardContent>
  );
}
