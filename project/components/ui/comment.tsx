import { useUpdateTaskDiscussion } from "@/hooks/use-task-discussions";
import { Edit, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import Button from "./buttons/button";
import Dropdown from "./dropdowns/drop-down";
import RichTextEditor from "./input-fields/rich-text-editor";
import { showErrorToast, showSuccessToast } from "./toast";

interface CommentProps {
  id: string;
  taskId: string;
  content: string;
  isEdited: boolean;
  authorName: string;
  authorImage: string;
  lastModified: string;
  isUserDiscussion: boolean;
}

export default function Comment({
  id,
  taskId,
  content,
  isEdited,
  authorName,
  authorImage,
  lastModified,
  isUserDiscussion
}: CommentProps) {
  const [isEditState, setIsEditState] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const { isUpdatingTaskDiscussion, updateTaskDiscussion } =
    useUpdateTaskDiscussion(taskId);

  const handleContentChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setEditedContent(evt.target.value);
  };

  const saveEdit = async () => {
    const { success, message } = await updateTaskDiscussion({
      id,
      taskId,
      content: editedContent
    });

    if (!success) return showErrorToast(message);
    showSuccessToast(message);
    setIsEditState(false);
  };

  const cancelEdit = () => {
    setEditedContent(content); // Reset to original
    setIsEditState(false);
  };

  const items = [
    {
      onClick: () => setIsEditState(true),
      label: "Edit",
      icon: Edit
    }
  ];

  return (
    <div className="flex items-start gap-5">
      <Image
        width={30}
        height={30}
        alt={authorName}
        src={authorImage}
        className="rounded-full"
      />
      <div className="ring-primary/20 w-full space-y-2 rounded-sm bg-white p-4 ring-1 dark:bg-neutral-800">
        <div className="flex items-center justify-between">
          <p className="text-sm leading-none font-medium text-neutral-700 dark:text-neutral-300">
            {isUserDiscussion ? "You" : authorName}
          </p>

          {isUserDiscussion && !isEditState && (
            <Dropdown
              label={<MoreHorizontal size={14} />}
              items={items}
              className="text-neutral-700 dark:text-neutral-300"
            />
          )}
        </div>

        <p className="text-xs leading-none text-neutral-500">
          {isEdited ? "Edited" : "Posted"} {lastModified}
        </p>

        {isEditState && (
          <div className="space-y-2">
            <RichTextEditor
              id="edited-content"
              name="editedContent"
              value={editedContent}
              required
              placeholder="Edited Content"
              onChange={handleContentChange}
            />

            <div className="flex justify-end gap-2">
              <Button
                onClick={cancelEdit}
                className="bg-neutral-200 px-3 py-2 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                Cancel
              </Button>
              <Button
                onClick={saveEdit}
                isProcessing={isUpdatingTaskDiscussion}
                className="bg-primary px-3 py-2 text-xs text-neutral-100">
                Save
              </Button>
            </div>
          </div>
        )}

        {!isEditState && (
          <p
            className="rounded-sm bg-neutral-100 p-3 text-sm leading-5 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
