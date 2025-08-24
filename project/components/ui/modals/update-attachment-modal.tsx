import { useUpdateTaskAttachment } from "@/hooks/use-tasks";
import { TaskSchema } from "@/types/tasks";
import { ChangeEvent, FormEvent, useState } from "react";
import Button from "../buttons/button";
import Input from "../input-fields/input";
import { showErrorToast, showSuccessToast } from "../toast";
import Modal from "./modal";

interface UpdateAttachmentModalProps {
  toggle: () => void;
  taskId: TaskSchema["id"];
}

export function UpdateAttachmentModal({
  toggle,
  taskId
}: UpdateAttachmentModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const { isUpdatingAttachment, updateAttachment } =
    useUpdateTaskAttachment(taskId);

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) setFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    const { success, message } = await updateAttachment({ id: taskId, file });
    if (!success) return showErrorToast(message);
    showSuccessToast(message);

    toggle();
  };

  return (
    <Modal
      toggle={toggle}
      title="Update Attachment">
      <Input
        id="attachment"
        name="attachment"
        label="Attachment"
        type="file"
        required
        onChange={handleFileChange}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={toggle}
          className="bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          isProcessing={isUpdatingAttachment}
          className="bg-primary text-neutral-100">
          Save Attachment
        </Button>
      </div>
    </Modal>
  );
}
