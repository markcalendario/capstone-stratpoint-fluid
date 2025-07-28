import { Header } from "@/components/header";
import { ArrowRight, CheckCircle, Kanban, Users } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <Header />
      <Home />
    </Fragment>
  );
}

function Home() {
  return (
    <div className="from-platinum-900 to-platinum-800 dark:from-outer_space-500 dark:to-payne's_gray-500 min-h-screen bg-gradient-to-br">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-outer_space-500 dark:text-platinum-500 mb-6 text-5xl font-bold md:text-6xl">
            Manage Projects with
            <span className="text-blue_munsell-500"> Kanban Boards</span>
          </h1>

          <p className="text-payne's_gray-500 dark:text-french_gray-500 mx-auto mb-8 max-w-2xl text-xl">
            Organize tasks, collaborate with teams, and track progress with our
            intuitive drag-and-drop project management platform.
          </p>

          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="bg-blue_munsell-500 hover:bg-blue_munsell-600 inline-flex items-center rounded-lg px-8 py-4 text-lg font-semibold text-white">
              Start Managing Projects
              <ArrowRight
                className="ml-2"
                size={20}
              />
            </Link>
            <Link
              href="/projects"
              className="border-blue_munsell-500 text-blue_munsell-500 hover:bg-blue_munsell-50 dark:hover:bg-blue_munsell-900 inline-flex items-center rounded-lg border-2 px-8 py-4 text-lg font-semibold">
              View Projects
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-outer_space-500 dark:text-platinum-500 flex items-center justify-center space-x-2">
              <Kanban
                className="text-blue_munsell-500"
                size={20}
              />
              <span>Drag & Drop Boards</span>
            </div>
            <div className="text-outer_space-500 dark:text-platinum-500 flex items-center justify-center space-x-2">
              <Users
                className="text-blue_munsell-500"
                size={20}
              />
              <span>Team Collaboration</span>
            </div>
            <div className="text-outer_space-500 dark:text-platinum-500 flex items-center justify-center space-x-2">
              <CheckCircle
                className="text-blue_munsell-500"
                size={20}
              />
              <span>Task Management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Demo Section */}
      <section className="dark:bg-outer_space-400/50 bg-white/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-outer_space-500 dark:text-platinum-500 mb-8 text-3xl font-bold">
            🚀 Navigate the Mock Site
          </h2>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mb-8 text-lg">
            All pages are accessible without authentication for development
            purposes
          </p>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard"
              className="border-french_gray-300 dark:border-payne's_gray-400 dark:bg-outer_space-500 rounded-lg border bg-white p-4 transition-shadow hover:shadow-lg">
              <h3 className="text-outer_space-500 dark:text-platinum-500 mb-2 font-semibold">
                Dashboard
              </h3>
              <p className="text-payne's_gray-500 dark:text-french_gray-400 text-sm">
                Main dashboard view
              </p>
            </Link>

            <Link
              href="/projects"
              className="border-french_gray-300 dark:border-payne's_gray-400 dark:bg-outer_space-500 rounded-lg border bg-white p-4 transition-shadow hover:shadow-lg">
              <h3 className="text-outer_space-500 dark:text-platinum-500 mb-2 font-semibold">
                Projects
              </h3>
              <p className="text-payne's_gray-500 dark:text-french_gray-400 text-sm">
                Projects listing page
              </p>
            </Link>

            <Link
              href="/projects/1"
              className="border-french_gray-300 dark:border-payne's_gray-400 dark:bg-outer_space-500 rounded-lg border bg-white p-4 transition-shadow hover:shadow-lg">
              <h3 className="text-outer_space-500 dark:text-platinum-500 mb-2 font-semibold">
                Kanban Board
              </h3>
              <p className="text-payne's_gray-500 dark:text-french_gray-400 text-sm">
                Project board view
              </p>
            </Link>

            <Link
              href="/sign-in"
              className="border-french_gray-300 dark:border-payne's_gray-400 dark:bg-outer_space-500 rounded-lg border bg-white p-4 transition-shadow hover:shadow-lg">
              <h3 className="text-outer_space-500 dark:text-platinum-500 mb-2 font-semibold">
                Auth Pages
              </h3>
              <p className="text-payne's_gray-500 dark:text-french_gray-400 text-sm">
                Sign in/up placeholders
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Task Implementation Status */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-outer_space-500 dark:text-platinum-500 mb-12 text-center text-3xl font-bold">
            Implementation Roadmap
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                phase: "1.0",
                title: "Project Setup",
                status: "pending",
                tasks: 6
              },
              {
                phase: "2.0",
                title: "Authentication",
                status: "pending",
                tasks: 6
              },
              {
                phase: "3.0",
                title: "Database Setup",
                status: "pending",
                tasks: 6
              },
              {
                phase: "4.0",
                title: "Core Features",
                status: "pending",
                tasks: 6
              },
              {
                phase: "5.0",
                title: "Kanban Board",
                status: "pending",
                tasks: 6
              },
              {
                phase: "6.0",
                title: "Advanced Features",
                status: "pending",
                tasks: 6
              },
              { phase: "7.0", title: "Testing", status: "pending", tasks: 6 },
              { phase: "8.0", title: "Deployment", status: "pending", tasks: 6 }
            ].map((item) => (
              <div
                key={item.phase}
                className="border-french_gray-300 dark:border-payne's_gray-400 dark:bg-outer_space-500 rounded-lg border bg-white p-6">
                <div className="text-blue_munsell-500 mb-2 text-sm font-semibold">
                  Phase {item.phase}
                </div>
                <h3 className="text-outer_space-500 dark:text-platinum-500 mb-2 font-semibold">
                  {item.title}
                </h3>
                <div className="text-payne's_gray-500 dark:text-french_gray-400 mb-3 text-sm">
                  {item.tasks} tasks
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-payne's_gray-500 dark:text-french_gray-400 text-sm capitalize">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
