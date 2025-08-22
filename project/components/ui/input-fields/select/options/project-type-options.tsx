import { projectTypes } from "@/lib/utils/constants";
import { toTitleCase } from "@/lib/utils/formatters";
import { Fragment } from "react";

export default function ProjectTypeOptions() {
  return (
    <Fragment>
      <option value="">Select Project Type</option>
      {projectTypes.map((type) => (
        <option
          key={type}
          value={type}>
          {toTitleCase(type)}
        </option>
      ))}
    </Fragment>
  );
}
