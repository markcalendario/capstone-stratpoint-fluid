"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import ProjectsList from "@/components/sections/projects/projects-list";
import SearchFilter from "@/components/sections/projects/search-filter";
import { useState } from "react";

export default function ProjectsPage() {
  const [searchText, setSearchText] = useState("");

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <DashboardContent
      title="Projects"
      description="Manage and organize your projects.">
      <div className="space-y-6">
        <SearchFilter onSearchTextChange={handleSearchTextChange} />
        <ProjectsList searchText={searchText} />
      </div>
    </DashboardContent>
  );
}
