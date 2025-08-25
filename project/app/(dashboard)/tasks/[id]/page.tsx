"use client";

import { DashboardContent } from "@/components/layouts/dashboard/dashboard-content";
import TaskAttachment from "@/components/sections/task-slug/task-attachment";
import TaskDescription from "@/components/sections/task-slug/task-description";
import TaskDiscussions from "@/components/sections/task-slug/task-discussion";
import TaskSlugBanner from "@/components/sections/task-slug/task-slug-banner";
import SectionLoader from "@/components/ui/section-loader";
import SliderTab from "@/components/ui/slider";
import { useTaskSlug } from "@/hooks/use-tasks";
import { useParams } from "next/navigation";
import { Fragment, useState } from "react";

export default function TaskSlugPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("task");
  const id = params.id as string;

  const { isTaskSlugDataLoading, taskSlugData } = useTaskSlug(id);
  const task = taskSlugData?.task;

  if (isTaskSlugDataLoading || !task) {
    return <SectionLoader text="Loading Task" />;
  }

  const tabs = [
    { label: "Task", value: "task" },
    { label: "Attachment", value: "attachment" },
    { label: "Discussions", value: "discussions" }
  ];

  return (
    <Fragment>
      <TaskSlugBanner
        id={id}
        {...task}
      />

      <DashboardContent tight>
        <SliderTab
          tabs={tabs}
          active={activeTab}
          onChange={(value: string) => setActiveTab(value)}
        />
      </DashboardContent>

      {activeTab === "attachment" && (
        <TaskAttachment attachment={task.attachment} />
      )}

      {activeTab === "task" && (
        <TaskDescription description={task.description} />
      )}

      {activeTab === "discussions" && <TaskDiscussions taskId={id} />}
    </Fragment>
  );
}
