import { ProjectSchema } from "./projects";

export interface GetProjectProgressPayload {
  projectId: ProjectSchema["id"];
}

export interface GetStatusByPriorityPayload {
  projectId: ProjectSchema["id"];
}
