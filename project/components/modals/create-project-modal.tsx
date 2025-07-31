// TODO: Task 4.1 - Implement project CRUD operations
// TODO: Task 4.4 - Build task creation and editing functionality

/*
TODO: Implementation Notes for Interns:

Modal for creating new projects with form validation.

Features to implement:
- Form with project name, description, due date
- Zod validation
- Error handling
- Loading states
- Success feedback
- Team member assignment
- Project template selection

Form fields:
- Name (required)
- Description (optional)
- Due date (optional)
- Team members (optional)
- Project template (optional)
- Privacy settings

Integration:
- Use project validation schema from lib/validations.ts
- Call project creation API
- Update project list optimistically
- Handle errors gracefully
*/

import Button from "../button";
import Input from "../input";
import Textarea from "../textarea";
import Modal from "./modal";

interface CreateProjectModalProps {
  toggle: () => void;
}

export function CreateProjectModal({ toggle }: CreateProjectModalProps) {
  return (
    <Modal
      toggle={toggle}
      title="Create New Project">
      <form className="space-y-4">
        <Input
          id="name"
          label="Project Name"
          placeholder="Enter project name"
        />

        <Textarea
          id="description"
          label="Project Description"
          placeholder="Enter project description"
        />

        <Input
          id="date"
          label="Project Due Date"
          placeholder="Enter due date"
          type="date"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            onClick={toggle}
            className="text-neutral-800 dark:text-neutral-100">
            Cancel
          </Button>
          <Button className="bg-primary text-neutral-100">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
