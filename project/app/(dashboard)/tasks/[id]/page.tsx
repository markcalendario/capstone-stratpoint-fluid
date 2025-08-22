"use client";

import TaskDescription from "@/components/sections/task-slug/task-description";
import TaskSlugBanner from "@/components/sections/task-slug/task-slug-banner";
import SectionLoader from "@/components/ui/section-loader";
import { useTaskSlug } from "@/hooks/use-tasks";
import { useParams } from "next/navigation";
import { Fragment } from "react";

export default function TaskSlugPage() {
  const params = useParams();
  const id = params.id as string;

  const { isTaskSlugDataLoading, taskSlugData } = useTaskSlug(id);

  if (isTaskSlugDataLoading || !taskSlugData?.task) {
    return <SectionLoader text="Loading Task" />;
  }

  return (
    <Fragment>
      <TaskSlugBanner {...taskSlugData.task} />
      <TaskDescription description={taskSlugData.task.description} />
    </Fragment>
  );
}
